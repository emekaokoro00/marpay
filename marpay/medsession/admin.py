from django.contrib import admin
from .models import MedSession

# Register your models here.

@admin.register(MedSession)
class MedSessionAdmin(admin.ModelAdmin):
    fields = (
        'id', 'status', 'created', 'updated', 'session_customer', 'session_telehealthworker', 'session_physician', 
        'session_address_for_telehealthworker', 'session_address',
    )
    list_display = (
        'id', 'status', 'created', 'updated', 'session_customer', 'session_telehealthworker', 'session_physician', 
        'session_address_for_telehealthworker', 'session_address',
    )
    list_filter = (
        'status',
    )
    readonly_fields = (
        'id', 'created', 'updated',
    )
    
    