from django.shortcuts import render
from rest_framework import generics, permissions, status, views, viewsets
from django.db.models import Q

from .models import MedSession
from .serializers import ReadOnlyMedSessionSerializer
from myuser.models import Role

# Create your views here.

user_group_names = ['customer', 'telehealthworker', 'physician'];

class MedSessionView(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'id'
    lookup_url_kwarg = 'medsession_id'
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ReadOnlyMedSessionSerializer
    
    # queryset = MedSession.objects.all()
    
    def get_queryset(self): # new
        user = self.request.user        
#         customer_role = Role(Role.CUSTOMER)
#         thw_role = Role(Role.TELEHEALTHWORKER)
#         physician_role = Role(Role.PHYSICIAN)
        # if user.group == 'driver':
        # return MedSession.objects.all()
        
        if user.current_group.name == user_group_names[1]:
            return MedSession.objects.filter(
                Q(status=MedSession.REQUESTED) | Q(session_telehealthworker=user)
            )
        if user.current_group.name == user_group_names[2]:
            return MedSession.objects.filter(
                Q(status=MedSession.REQUESTED) | Q(session_physician=user)
            )
        if user.current_group.name == user_group_names[0]:
            return MedSession.objects.filter(session_customer=user)
        return MedSession.objects.none()
