from django.contrib import admin
from .models import MedSession

# Register your models here.

@admin.register(MedSession)
class MedSessionAdmin(admin.ModelAdmin):
    fields = (
        'id', 'session_address', 'status', 'created', 'updated', 'session_customer',
    )
    list_display = (
        'id', 'session_address', 'status', 'created', 'updated', 'session_customer',
    )
    list_filter = (
        'status',
    )
    readonly_fields = (
        'id', 'created', 'updated',
    )
    