from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import MyUser, Role, CustomerDetails
from django.forms.models import ModelForm


class SignUpForm(UserCreationForm):
    username = forms.CharField(max_length=50, required=False, help_text='*. 50 characters or less. Letters, digits and @/./+/-/_ only.')
    first_name = forms.CharField(max_length=30, required=False)
    last_name = forms.CharField(max_length=30, required=False)
    email = forms.EmailField(max_length=254, help_text='*. Enter a valid email address.')
    # current_role = forms.ChoiceField(choices=Role.ROLE_CHOICES)
    
    class Meta:
        model = MyUser
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', )        

class MyUserUpdateForm(ModelForm):
    password = None
    first_name = forms.CharField(max_length=30, required=False)
    last_name = forms.CharField(max_length=30, required=False)
    # email = forms.EmailField(max_length=254, help_text='*. Enter a valid email address.')
    
    class Meta:
        model = MyUser
        fields = ('first_name', 'last_name',)
        
        
class CustomerDetailsUpdateForm(ModelForm):
    password = None
    medical_record_summary = forms.CharField(max_length=30, required=False)
    insurance_provider_summary = forms.CharField(max_length=30, required=False)
    
    class Meta:
        model = CustomerDetails
        fields = ('medical_record_summary', 'insurance_provider_summary',)
        
#========================================================================================================

class AdminUserCreateForm(UserCreationForm):
    
    class Meta:
        model = MyUser
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', ) 
        
        
        