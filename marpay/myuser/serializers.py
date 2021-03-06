from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.conf import settings
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Role

# import marpay
import mytask

import logging
logger = logging.getLogger(__name__)




class MyUserBaseSerializer(serializers.ModelSerializer): 
    current_group = serializers.CharField() # set so that the group is made string on client side     
    # groups = serializers.ListField(child=serializers.CharField()) # set so that the group is made string on client side  
  
class MyUserPasswordChangeSerializer(MyUserBaseSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True) 

class MyUserUpdateSerializer(MyUserBaseSerializer):   
    
    def update(self, instance, validated_data):
        # pop out current_group first to remove from validated_data
        dummy_groups_data = validated_data.pop('groups') # may be unnecessary
        current_group_data = validated_data.pop('current_group')
        current_group, _ = Group.objects.get_or_create(name=current_group_data)
        
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        
        instance.current_group = current_group
        # instance.groups.add(current_group)   
        instance.save()
        return instance 
  
    class Meta:
        model = get_user_model()
        fields = (
            'id', 'username', 
            'first_name', 'last_name', 'current_group', 'groups',
        )
        read_only_fields = ('id',)
  
class MyUserSerializer(MyUserBaseSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError('Passwords must match.')
        return data

    def create(self, validated_data):
        # pop out group and current_group first to remove from validated_data
        dummy_groups_data = validated_data.pop('groups')
        current_group_data = validated_data.pop('current_group')
        current_group, _ = Group.objects.get_or_create(name=current_group_data)
        
        data = {
            key: value for key, value in validated_data.items()
            if key not in ('password1', 'password2')
        }
        data['password'] = validated_data['password1']
        # data['current_role'] = validated_data['current_role'] 
        data['email'] = data['username'] # make email = username  
        
        user = self.Meta.model.objects.create_user(**data)        
        user.current_group = current_group
        user.groups.add(current_group)                    
        user.save()
        
        if (settings.SEND_EMAIL_ON_USER_CREATE):
            user_email = data['email']        
            # logger.debug('\r\n\r\n\r\ndirect email start')
            logger.debug('SENDGRID_API_KEY = ' + settings.SENDGRID_API_KEY) 
            mytask.views.send_email(user_email) # should have instructions for making use become active 
            
        return user

    class Meta:
        model = get_user_model()
        fields = (
            'id', 'username', 'password1', 'password2',
            'first_name', 'last_name', 'current_group', 'groups'
        )
        read_only_fields = ('id',)