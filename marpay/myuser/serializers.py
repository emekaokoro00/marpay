from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Role

import sys


# class RoleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Role
#         fields = ('id',)
    

class MyUserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)   
    # current_role = RoleSerializer() 
    current_role = serializers.CharField()


    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError('Passwords must match.')
        return data

#     def update(self, instance, validated_data):
#         mode_of_payment = validated_data.pop('mode_of_payment')
#         instance.mode_of_payment_id = mode_of_payment.id
#         return instance

    def create(self, validated_data):
        
        # handling foreign-key current_role to build up object and save
        current_role_id = validated_data.pop('current_role')
        current_role = Role(Role.CUSTOMER)
        current_role = current_role.set_role(new_id=current_role_id)
        
        data = {
            key: value for key, value in validated_data.items()
            if key not in ('password1', 'password2')
        }
        data['password'] = validated_data['password1']
        # data['current_role'] = validated_data['current_role']
        
        user = self.Meta.model.objects.create_user(**data)
        
        user.current_role = current_role                                 
        user.save() 
        return user

    class Meta:
        model = get_user_model()
        fields = (
            'id', 'username', 'password1', 'password2',
            'first_name', 'last_name', 
            'current_role'
        )
        read_only_fields = ('id',)