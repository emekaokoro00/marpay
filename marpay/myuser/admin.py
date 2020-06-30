from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import MyUser
from .forms import AdminUserCreateForm

# Register your models here.

@admin.register(MyUser)
class MyUserAdmin(UserAdmin):
    add_form = AdminUserCreateForm
    # form = AdminUserChangeForm
    model = MyUser
    list_display = ['email', 'username', 'current_group']
    
    # Take out from admin later
    fieldsets = UserAdmin.fieldsets + (
        (None, {
            'fields': ('current_group',),
        }),
    )

    
# admin.site.register(MyUser, MyUserAdmin)