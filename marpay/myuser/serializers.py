from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers
from .models import Role

import sys


class MyUserUpdateSerializer(serializers.ModelSerializer):    
  
    class Meta:
        model = get_user_model()
        fields = (
            'id', 'first_name', 'last_name'
        )
        read_only_fields = ('id',)
  

class MyUserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)   
    # current_role = serializers.CharField() 
    current_group = serializers.CharField() # set so that the group is made string on client side
    
    #HANDLE password1 and password2 in sigun-up.cmponents.html file


    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError('Passwords must match.')
        return data
    
#     def update(self, instance, validated_data):
#         instance.first_name = validated_data.get('first_name', instance.first_name)
#         instance.last_name = validated_data.get('last_name', instance.last_name)
#         instance.save()
#         return instance

    def create(self, validated_data):
        # pop out group first
        current_group_data = validated_data.pop('current_group')
        current_group, _ = Group.objects.get_or_create(name=current_group_data)
        
        data = {
            key: value for key, value in validated_data.items()
            if key not in ('password1', 'password2')
        }
        data['password'] = validated_data['password1']
        # data['current_role'] = validated_data['current_role']
        
        user = self.Meta.model.objects.create_user(**data)
        
        user.current_group = current_group
        user.groups.add(current_group)                                  
        user.save() 
        return user

    class Meta:
        model = get_user_model()
        fields = (
            'id', 'username', 'password1', 'password2',
            'first_name', 'last_name', 'current_group'
        )
        read_only_fields = ('id',)