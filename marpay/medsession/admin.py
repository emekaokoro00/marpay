from django.contrib import admin
from .models import MedSession

# Register your models here.

@admin.register(MedSession)
class MedSessionAdmin(admin.ModelAdmin):
    fields = (
        'id', 'status', 'status_to_physician', 'created', 'updated', 'session_customer', 'session_telehealthworker', 'session_physician', 
        'session_address_for_telehealthworker', 'session_address', 'session_reason',
    )
    list_display = (
        'id', 'status', 'status_to_physician', 'created', 'updated', 'session_customer', 'session_telehealthworker', 'session_physician', 
        'session_address_for_telehealthworker', 'session_address', 'session_reason',
    )
    list_filter = (
        'status',
    )
    readonly_fields = (
        'id', 'created', 'updated',
    )
    
    
    'status_to_physician', 'session_reason'