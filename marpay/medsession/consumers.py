import asyncio
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from .models import MedSession
from .serializers import MedSessionSerializer, ReadOnlyMedSessionSerializer

import json

#PUT IN config file LATER
user_group_names = ['customer', 'telehealthworker', 'physician'];
channel_group_names = ['telehealthworker_channel_group','physician_channel_group']

class MedSessionConsumer(AsyncJsonWebsocketConsumer):

    def __init__(self, scope):
        super().__init__(scope)
        self.medsessions = set() 
  
    async def connect(self):
        user = self.scope['user']
        if user.is_anonymous:
            await self.close()
        else:
            channel_groups = []            
  
            # Add a telehealthworker to the 'telehealthworker' group.
            # user_group = user.current_group.name            
            user_group_name = await self._get_user_group_name(self.scope['user']) ### replace by upper, since no call to database
            if user_group_name == user_group_names[1]:
                channel_groups.append(self.channel_layer.group_add(
                    group='telehealthworker_channel_group', # replace by channel_group_names indexing later
                    channel=self.channel_name
                ))
              
            # Get medsessions and add customer to each one's group.
            self.medsessions = await self.retrieve_medsessions()
                          
            await self.append_to_channel_groups(channel_groups)
                  
            asyncio.gather(*channel_groups)
              
            await self.accept()          
  
    async def receive_json(self, content, **kwargs):        
        # RECEIVES JSON FROM CLIENT
        # DELEGATE BUSINESS LOGIC TO DO DIFFERENT THINGS  
        message_type = content.get('type')
        if message_type == 'create.medsession':
            await self.create_medsession(content)
        elif message_type == 'update.medsession':
            await self.update_medsession(content)      
      
    async def echo_message(self, event):    
        # await self.send_json({'type': 'echo.message','data': event['data']})
        await self.send_json(event)    
     
    async def create_medsession(self, event):
        medsession = await self._create_medsession(event.get('data'))
        medsession_id = f'{medsession.id}'
        medsession_data = await self._get_medsession_data(medsession)
                                  
        # Send customer requests to all telehealthworkers.
        await self.channel_layer.group_send(group='telehealthworker_channel_group', message={
            'type': 'echo.message',
            'data': medsession_data
        })
        
        if medsession_id not in self.medsessions:
            self.medsessions.add(medsession_id)                
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
        medsession_data =  await self._get_medsession_data(medsession)
  
        # Send updates to riders that subscribe to this trip.
        await self.channel_layer.group_send(group=medsession_id, message={
            'type': 'echo.message',
            'data': medsession_data
        })
          
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
  
        # Discard telehealthworker from 'telehealthworker' group.
        user_group_name = await self._get_user_group_name(self.scope['user'])
        if user_group_name == user_group_names[1]:
            channel_groups.append(self.channel_layer.group_discard(
                group='telehealthworker_channel_group',
                channel=self.channel_name
            ))
          
        asyncio.gather(*channel_groups)
  
        # Remove all references to medsessions.
        self.medsessions.clear()
  
        await super().disconnect(code)
  
# ========DATABASE SYNC FUNCTIONS====================================================
  
    @database_sync_to_async
    def retrieve_medsessions(self):
        medsessions = set([
                str(medsession_id) for medsession_id in self._get_medsessions(self.scope['user'])
            ]) 
        return medsessions
  
    @database_sync_to_async
    def append_to_channel_groups(self, channel_groups):
        for medsession in self.medsessions:
            channel_groups.append(self.channel_layer.group_add(medsession, self.channel_name))
            
    @database_sync_to_async
    def _create_medsession(self, content):
        serializer = MedSessionSerializer(data=content)
        serializer.is_valid(raise_exception=True)
        medsession = serializer.create(serializer.validated_data)
        return medsession
                  
    @database_sync_to_async
    def _update_medsession(self, content):
        instance = MedSession.objects.get(id=content.get('id'))
        serializer = MedSessionSerializer(data=content)
        serializer.is_valid(raise_exception=True)
        medsession = serializer.update(instance, serializer.validated_data)
        return medsession
    
    @database_sync_to_async
    def _get_medsession_data(self, medsession):
        medsession_data = ReadOnlyMedSessionSerializer(medsession).data
        return medsession_data
               
#             
    @database_sync_to_async
    def _get_user_group_name(self, user):
        if not user.is_authenticated:
            raise Exception('User is not authenticated.')        
        return user.current_group.name # or  user.groups.first().name
    
    
# ========OTHER HELPER FUNCTIONS====================================================
                             
    def _get_medsessions(self, user):
        if not user.is_authenticated:
            raise Exception('User is not authenticated.')        
        user_groups = user.groups.values_list('name', flat=True)
        # user_groups = await get_user_group_value_list_data(user)
        if 'telehealthworker' in user_groups:
            return user.session_telehealthworker.exclude(
                status=MedSession.COMPLETED
            ).only('id').values_list('id', flat=True)
        else:
            return user.session_customer.exclude(
                status=MedSession.COMPLETED
            ).only('id').values_list('id', flat=True)   
    
    
    
# =================================================================================
     
#         
#     async def connect(self):
#         user = self.scope['user']
#         if user.is_anonymous:
#             await self.close()
#         else:
#             await self.accept()
#         
# #     async def connect(self):
# #         await self.accept()
# 
#     async def disconnect(self, code):        
#         await super().disconnect(code)
#         # pass
# 
#     async def receive_json(self, content, **kwargs):    
#         await self.send_json({
#             'type': 'create.medsession',
#             'data': 'test'
#         })
#         
#     async def echo_message(self, event):
#         await self.send_json(event)
#         