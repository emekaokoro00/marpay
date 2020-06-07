from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import MyUser
from .forms import SignUpForm

# Register your models here.

class MyUserAdmin(UserAdmin):
    add_form = SignUpForm
    # form = CustomUserChangeForm
    model = MyUser
    list_display = ['email', 'username',]
    
admin.site.register(MyUser, MyUserAdmin)