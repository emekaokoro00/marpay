import uuid

from django.db import models
from django.shortcuts import reverse
from myuser.models import MyUser


class MedSession(models.Model):
    REQUESTED = 'REQUESTED'
    STARTED = 'STARTED'
    IN_PROGRESS = 'IN_PROGRESS'
    COMPLETED = 'COMPLETED'
    STATUSES = (
        (REQUESTED, REQUESTED),
        (STARTED, STARTED),
        (IN_PROGRESS, IN_PROGRESS),
        (COMPLETED, COMPLETED),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUSES, default=REQUESTED)
    
    session_customer = models.ForeignKey(MyUser, on_delete=models.PROTECT, related_name='session_customer', null=True, blank=True) 
    session_telehealthworker = models.ForeignKey(MyUser, on_delete=models.PROTECT, related_name='session_telehealthworker', null=True, blank=True) 
    session_physician = models.ForeignKey(MyUser, on_delete=models.PROTECT, related_name='session_physician', null=True, blank=True) 
    session_attendants = models.ManyToManyField(MyUser) # enforce to least one attending worker i.e. physician. THW is optional.
    session_address = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.id}'

    def get_absolute_url(self):
        return reverse('medsession:medsession_detail', kwargs={'medsession_id': self.id})