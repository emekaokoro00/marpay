from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import Client
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from channels.testing import WebsocketCommunicator
import pytest

from medsession.models import MedSession
# from django.contrib.auth.models import Group

# from ...marpay.routing import application
from marpay.routing import application

import sys
import asyncio
import logging


# sys.stderr.write('\n Return Code is:' + str(the_current_role.id) + ' \n')

TEST_CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}
user_group_names = ['customer', 'telehealthworker', 'physician'];


@database_sync_to_async
def create_user(
    *,
    username='rider@example.com',
    password='spartan123',
    current_group=user_group_names[0]
):
    # Create user.
    user = get_user_model().objects.create_user(
        username=username,
        password=password
    )        
    
    # Create user group.
    user_group, _ = Group.objects.get_or_create(name=current_group)
    user.set_current_group(user_group)
    user.groups.add(user_group)
    
    user.save()
    return user        

@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestWebsockets:

### test functions##################################################################

    async def test_authorized_user_can_connect(self, settings):        
        # Use in-memory channel layers for testing.
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
     
        user = await create_user(
            username='rider@example.com',
            current_group=user_group_names[0]
        )
        communicator = await auth_connect(user)
        await communicator.disconnect()
         
 
    async def test_customer_can_create_medsessions(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
     
        user = await create_user(
            username='rider@example.com',
            current_group=user_group_names[0]
        )
        communicator = await connect_and_create_medsession(user=user)
     
        # Receive JSON message from server.
        response = await communicator.receive_json_from()        
        data = response.get('data')
     
        # Confirm data.
        assert data['id'] is not None
        assert 'A' == data['session_address_for_telehealthworker']
        assert 'B' == data['session_address']
        assert MedSession.REQUESTED == data['status']
        assert data['session_telehealthworker'] is None
        assert user.username == data['session_customer'].get('username')
     
        await communicator.disconnect()
   

    async def test_customer_is_added_to_medsession_group_on_create(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        user = await create_user(
            username='rider@example.com',
            current_group=user_group_names[0]
        )

        # Connect and send JSON message to server.
        communicator = await connect_and_create_medsession(user=user)

        # Receive JSON message from server.
        # Customer should be added to new medsession's group.
        response = await communicator.receive_json_from()
        data = response.get('data')
        
        medsession_id = data['id']
        message = {
            'type': 'echo.message',
            'data': 'This is a test message.'
        }

        # Send JSON message to new medsession's group.
        channel_layer = get_channel_layer()
        await channel_layer.group_send(medsession_id, message=message)
        
        # Receive JSON message from server.
        response = await communicator.receive_json_from()

        # Confirm data.
        assert message == response

        await communicator.disconnect()
        
        
    async def test_customer_is_added_to_medsession_groups_on_connect(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        user = await create_user(
            username='rider3@example.com',
            current_group=user_group_names[0]
        )

        # Create trips and link to rider.
        medsession = await create_medsession(
            session_address_for_telehealthworker='A',
            session_address='B',
            session_customer=user
        )
        # Connect to server.
        # Trips for rider should be retrieved.
        # Rider should be added to trips' groups.
        communicator = await auth_connect(user)

        message = {
            'type': 'echo.message',
            'data': 'This is a test message.'
        }

        channel_layer = get_channel_layer()

        # Test sending JSON message to trip group.
        await channel_layer.group_send(f'{medsession.id}', message=message)
        response = await communicator.receive_json_from()
        assert message == response

        await communicator.disconnect()
        
        
    async def test_telehealthworker_can_update_medsessions(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        medsession = await create_medsession(
            session_address_for_telehealthworker='A',
            session_address='B'
        )
        user = await create_user(
            username='thw@example.com',
            current_group=user_group_names[1]
        )

        # Send JSON message to server.
        communicator = await connect_and_update_medsession(
            user=user,
            medsession=medsession,
            status=MedSession.IN_PROGRESS
        )

        # Receive JSON message from server.
        response = await communicator.receive_json_from()
        data = response.get('data')

        # Confirm data.
        assert str(medsession.id) == data['id']
        assert 'A' == data['session_address_for_telehealthworker']
        assert 'B' == data['session_address']
        assert MedSession.IN_PROGRESS == data['status']
        assert user.username == data['session_telehealthworker'].get('username')
        assert data['session_customer'] is None

        await communicator.disconnect()

        
    async def test_telehealthworker_is_added_to_medsession_group_on_update(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        medsession = await create_medsession(
            session_address_for_telehealthworker='A',
            session_address='B'
        )
        user = await create_user(
            username='thw@example.com',
            current_group=user_group_names[1]
        )

        # Send JSON message to server.
        communicator = await connect_and_update_medsession(
            user=user,
            medsession=medsession,
            status=MedSession.IN_PROGRESS
        )

        # Receive JSON message from server.
        response = await communicator.receive_json_from()
        data = response.get('data')

        medsession_id = data['id']
        message = {
            'type': 'echo.message',
            'data': 'This is a test message.'
        }

        # Send JSON message to trip's group.
        channel_layer = get_channel_layer()
        await channel_layer.group_send(medsession_id, message=message)

        # Receive JSON message from server.
        response = await communicator.receive_json_from()

        # Confirm data.
        assert message == response

        await communicator.disconnect()
    


    async def test_customer_is_alerted_on_medsession_update(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        medsession = await create_medsession(
            session_address_for_telehealthworker='A',
            session_address='B'
        )

        # Listen to the trip group test channel.
        channel_layer = get_channel_layer()
        await channel_layer.group_add(
            group=f'{medsession.id}',
            channel='test_channel'
        )

        user = await create_user(
            username='thw@example.com',
            current_group=user_group_names[1]
        )

        # Send JSON message to server.
        communicator = await connect_and_update_medsession(
            user=user,
            medsession=medsession,
            status=MedSession.IN_PROGRESS
        )

        # Receive JSON message from server on test channel.
        response = await channel_layer.receive('test_channel')
        data = response.get('data')

        # Confirm data.
        assert f'{medsession.id}' == data['id']
        assert user.username == data['session_telehealthworker'].get('username')

        await communicator.disconnect()

   
    async def test_telehealthworker_is_alerted_on_medsession_create(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
 
        # Listen to the 'telehealthworker_channel_group' group test channel.
        channel_layer = get_channel_layer()
        await channel_layer.group_add(
            group='telehealthworker_channel_group',
            channel='test_channel'
        )
 
        user = await create_user(
            username='rider@example.com',
            current_group=user_group_names[0]
        )
 
        # Send JSON message to server.
        communicator = await connect_and_create_medsession(user=user)
 
        sys.stderr.write('\n Return Code is: pass communicator \n')
        # Receive JSON message from server on test channel.
        response = await channel_layer.receive('test_channel')
        data = response.get('data')
        
        
        sys.stderr.write('\n Return Code is:' + str(data) + ' \n')
 
        # Confirm data.
        assert data['id'] is not None
        assert user.username == data['session_customer'].get('username')
 
        await communicator.disconnect()


### helper functions##################################################################



async def auth_connect(user):
    # Force authentication to get session ID.
    client = Client()
    await custom_force_login(client,user)    
    # client.force_login(user=user)

    # Pass session ID in headers to authenticate.
    communicator = WebsocketCommunicator(
        application=application,
        path='/marpay/',
        headers=[(
            b'cookie',
            f'sessionid={client.cookies["sessionid"].value}'.encode('ascii')
        )]
    )
    connected, _ = await communicator.connect()
    assert connected is True
    return communicator

async def connect_and_create_medsession(
    *,
    user,
    session_address_for_telehealthworker='A',
    session_address ='B'
):
    communicator = await auth_connect(user)
    await communicator.send_json_to({
        'type': 'create.medsession',
        'data': {
            'session_address_for_telehealthworker': session_address_for_telehealthworker,
            'session_address': session_address,
            'session_customer': user.id,
        }
    })
    return communicator

async def connect_and_update_medsession(*, user, medsession, status):
    communicator = await auth_connect(user)
    await communicator.send_json_to({
        'type': 'update.medsession',
        'data': {
            'id': f'{medsession.id}',
            'session_address_for_telehealthworker': medsession.session_address_for_telehealthworker,
            'session_address': medsession.session_address,
            'status': status,
            'session_telehealthworker': user.id,
        }
    })
    return communicator


@database_sync_to_async
def create_medsession(**kwargs):
    return MedSession.objects.create(**kwargs)

@database_sync_to_async
def custom_force_login(client, user):
    client.force_login(user=user)
    
@database_sync_to_async
def custom_json_receive(communicator):
    return communicator.receive_json_from()