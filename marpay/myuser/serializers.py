from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers
from .models import Role

import sys

  

class MyUserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)   
    # current_role = serializers.CharField() 
    # current_group = serializers.CharField()
    
    #HANDLE password1 and password2 in sigun-up.cmponents.html file


    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError('Passwords must match.')
        return data

#     def update(self, instance, validated_data):
#         mode_of_payment = validated_data.pop('mode_of_payment')
#         instance.mode_of_payment_id = mode_of_payment.id
#         return instance

    def create(self, validated_data):
        
        # DELETE LATER
        # handling foreign-key current_role to build up object and save
        current_role_name = validated_data.pop('current_role')
        current_role = Role(Role.CUSTOMER)
        current_role = current_role.set_role_from_name(role_name=current_role_name)
        
#         current_group_data = validated_data.pop('current_group')
#         current_group, _ = Group.objects.get_or_create(name=current_group_data)
        
        data = {
            key: value for key, value in validated_data.items()
            if key not in ('password1', 'password2')
        }
        data['password'] = validated_data['password1']
        # data['current_role'] = validated_data['current_role']
        
        user = self.Meta.model.objects.create_user(**data)
        
        # user.current_role = current_role  # DELETE LATER
        
#         user.set_current_group(current_group)
#         user.groups.add(current_group)
                                  
        user.save() 
        return user

    class Meta:
        model = get_user_model()
        fields = (
            'id', 'username', 'password1', 'password2',
            'first_name', 'last_name', 'current_role', 'current_group'
        )
        read_only_fields = ('id',)