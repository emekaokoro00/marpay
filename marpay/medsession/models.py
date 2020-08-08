import uuid

from django.db import models
from django.shortcuts import reverse
from myuser.models import MyUser


class MedSession(models.Model):
    REQUESTED = 'REQUESTED'
    STARTED = 'STARTED' # this means accepted
    IN_PROGRESS = 'IN_PROGRESS'
    COMPLETED = 'COMPLETED'
    CANCELLED = 'CANCELLED'
    STATUSES = (
        (REQUESTED, REQUESTED),
        (STARTED, STARTED),
        (IN_PROGRESS, IN_PROGRESS),
        (COMPLETED, COMPLETED),
        (CANCELLED, CANCELLED),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUSES, default=REQUESTED) # status between customer and thw
    status_to_physician = models.CharField(max_length=20, choices=STATUSES, default=REQUESTED) # status between customer/thw and physician
    
    session_reason = models.CharField(max_length=1000, null=True, blank=True)
    
    session_customer = models.ForeignKey(MyUser, on_delete=models.PROTECT, related_name='session_customer', null=True, blank=True) # related_name is user.sessions_as_customer
    session_telehealthworker = models.ForeignKey(MyUser, on_delete=models.PROTECT, related_name='session_telehealthworker', null=True, blank=True)
    session_physician = models.ForeignKey(MyUser, on_delete=models.PROTECT, related_name='session_physician', null=True, blank=True) 
    session_attendants = models.ManyToManyField(MyUser, blank=True) # enforce to least one attending worker i.e. physician. THW is optional.
    session_address = models.CharField(max_length=255, null=True, blank=True) # customer address/location
    session_address_for_telehealthworker = models.CharField(max_length=255, null=True, blank=True) # thw address... might not need this

    def __str__(self):
        return f'{self.id}'

    def get_absolute_url(self):
        return reverse('medsession:medsession_detail', kwargs={'medsession_id': self.id})