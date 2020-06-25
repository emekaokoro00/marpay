from django.shortcuts import render
from rest_framework import generics, permissions, status, views, viewsets
from django.db.models import Q

from .models import MedSession
from .serializers import MedSessionSerializer
from myuser.models import Role

# Create your views here.

class MedSessionView(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'id'
    lookup_url_kwarg = 'medsession_id'
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = MedSessionSerializer
    
    # queryset = MedSession.objects.all()
    
    def get_queryset(self): # new
        user = self.request.user        
        customer_role = Role(Role.CUSTOMER)
        thw_role = Role(Role.TELEHEALTHWORKER)
        physician_role = Role(Role.PHYSICIAN)
        # if user.group == 'driver':
        if user.current_role ==  thw_role:
            return MedSession.objects.filter(
                Q(status=MedSession.REQUESTED) | Q(session_thw=user)
            )
        if user.current_role ==  physician_role:
            return MedSession.objects.filter(
                Q(status=MedSession.REQUESTED) | Q(session_physician=user)
            )
        # if user.group == 'rider':
        if user.current_role ==  customer_role:
            return MedSession.objects.filter(session_customer=user)
        return MedSession.objects.none()
