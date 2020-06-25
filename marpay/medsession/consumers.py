import asyncio
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import MedSession
from .serializers import MedSessionSerializer, ReadOnlyMedSessionSerializer



class MedSessionConsumer(AsyncJsonWebsocketConsumer):

    def __init__(self, scope):
        super().__init__(scope)

        # Keep track of the user's medical sessions.
        self.medsessions = set()
        
    async def connect(self):
        user = self.scope['user']
        if user.is_anonymous:
            await self.close()
        else:            
#             # Get med sessions and add rider to each one's group.
#             channel_groups = []
#             
#                          
#             user_group = await self._get_user_group(self.scope['user'])
#             if user_group == 'physician':
#                 channel_groups.append(self.channel_layer.group_add(
#                     group='physicians',
#                     channel=self.channel_name
#                 ))
#             self.medsessions = set([
#                 str(medsession_id) for medsession_id in await self._get_medsessions(self.scope['user'])
#             ])
#             for medsession in self.medsession:
#                 channel_groups.append(self.channel_layer.group_add(medsession, self.channel_name))
#             asyncio.gather(*channel_groups)
                             
            await self.accept()
     
    async def receive_json(self, content, **kwargs):
        message_type = content.get('type')
        if message_type == 'create.medsession':
            await self.create_medsession(content)            
        elif message_type == 'update.medsession':
            await self.update_medsession(content)

    async def echo_message(self, event):
        await self.send_json(event)
        
    async def create_medsession(self, event):
        medsession = await self._create_medsession(event.get('data'))
        medsession_id = f'{medsession.id}'
        medsession_data = ReadOnlyMedSessionSerializer(medsession).data        
        
        # self.medsessions.add(medsession_id)
        
        await self.channel_layer.group_send(group='physicians', message={
            'type': 'echo.message',
            'data': medsession_data
        })        
        
        # Handle add only if medsesison is not being tracked.
        if medsession_id not in self.medsessions:
            self.medsessions.add(medsession_id)            
            # Add this channel to the new medsession's group.
            await self.channel_layer.group_add(
                group=medsession_id,
                channel=self.channel_name
            )
               
        await self.send_json({
            'type': 'create.medsession',
            'data': medsession_data
        })
        
    
    async def update_medsession(self, event):
        medsession = await self._update_medsession(event.get('data'))
        medsession_id = f'{medsession.id}'
        medsession_data = ReadOnlyMedSessionSerializer(medsession).data

        # Send updates to riders that subscribe to this medsession.
        await self.channel_layer.group_send(group=medsession_id, message={
            'type': 'echo.message',
            'data': medsession_data
        })

        # Handle add only if medsession is not being tracked.
        # This happens when a physician accepts a request.
        if medsession_id not in self.medsessions:
            self.medsessions.add(medsession_id)
            await self.channel_layer.group_add(
                group=medsession_id,
                channel=self.channel_name
            )

        await self.send_json({
            'type': 'update.medsession',
            'data': medsession_data
        })


    async def disconnect(self, code):
        # Remove this channel from every medsession's group.
        channel_groups = [
            self.channel_layer.group_discard(
                group=medsession,
                channel=self.channel_name
            )
            for medsession in self.medsessions
        ]       
        
        # Discard physician from 'physicians' group.           
        user_group = await self._get_user_group(self.scope['user'])
        if user_group == 'physician':
            channel_groups.append(self.channel_layer.group_discard(
                group='physicians',
                channel=self.channel_name
            ))
            
        asyncio.gather(*channel_groups)

        # Remove all references to medsessions.
        self.medsessions.clear()

        await super().disconnect(code)

    @database_sync_to_async
    def _create_medsession(self, content):
        serializer = MedSessionSerializer(data=content)
        serializer.is_valid(raise_exception=True)
        medsession = serializer.create(serializer.validated_data)
        return medsession
    
    
    # new
    @database_sync_to_async
    def _get_medsessions(self, user):
        if not user.is_authenticated:
            raise Exception('User is not authenticated.')
        # user_groups = user.groups.values_list('name', flat=True)
        user_groups = user.roles.values_list('name', flat=True) ############## DEBUG
        if 'physician' in user_groups:
            return user.medsessions_as_session_physician.exclude(
                status=MedSession.COMPLETED
            ).only('id').values_list('id', flat=True)
        elif 'telehealthworker' in user_groups:
            return user.medsessions_as_session_telehealthworker.exclude(
                status=MedSession.COMPLETED
            ).only('id').values_list('id', flat=True)
        else:
            return user.medsessions_as_session_customer.exclude(
                status=MedSession.COMPLETED
            ).only('id').values_list('id', flat=True)
            
    @database_sync_to_async
    def _get_user_group(self, user):
        if not user.is_authenticated:
            raise Exception('User is not authenticated.')        
        # return user.groups.first().name
        return user._get_user_current_role() # getting the role as the group
                
    @database_sync_to_async
    def _update_medsession(self, content):
        instance = MedSession.objects.get(id=content.get('id'))
        serializer = MedSessionSerializer(data=content)
        serializer.is_valid(raise_exception=True)
        medsession = serializer.update(instance, serializer.validated_data)
        return medsession