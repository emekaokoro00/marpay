from rest_framework import serializers
from .models import MedSession
from myuser.serializers import MyUserSerializer

class MedSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedSession
        fields = '__all__'
        read_only_fields = ('id', 'created', 'updated',)
        
class ReadOnlyMedSessionSerializer(serializers.ModelSerializer):
    driver = MyUserSerializer(read_only=True)
    rider = MyUserSerializer(read_only=True)

    class Meta:
        model = MedSession
        fields = '__all__'