from django.contrib.auth import get_user_model
from django.test import Client
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from channels.testing import WebsocketCommunicator
import pytest

# from ..models import MedSession
# from django.contrib.auth.models import Group

# from ...marpay.routing import application
from marpay.routing import application


TEST_CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}


@database_sync_to_async
def create_user(
    *,
    username='rider@example.com',
    password='spartan123',
    # group='rider'
):
    # Create user.
    user = get_user_model().objects.create_user(
        username=username,
        password=password
    )

    # Create user group.
    # user_group, _ = Group.objects.get_or_create(name=group)
    # user.groups.add(user_group)
    user.save()
    return user

@database_sync_to_async
def custom_force_login(client, user):
    client.force_login(user=user)
    

@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestWebsockets:

    async def test_authorized_user_can_connect(self, settings):
    # async def test_authorized_user_can_connect(    self):
        # Use in-memory channel layers for testing.
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        # Force authentication to get session ID.
        client = Client()
        user = await create_user()
        # client.force_login(user=user)
        await custom_force_login(client,user)

        # Pass session ID in headers to authenticate.
        communicator = WebsocketCommunicator(
            application=application,
            path='/medsession/',
            headers=[(
                b'cookie',
                f'sessionid={client.cookies["sessionid"].value}'.encode('ascii')
            )]
        )
        connected, _ = await communicator.connect()
        assert connected is True
        await communicator.disconnect()