from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from _datetime import datetime
from django.template.defaultfilters import default

# Create your models here.

user_group_names = ['customer', 'telehealthworker', 'physician'];

class Role(models.Model):
    CUSTOMER = 1
    TELEHEALTHWORKER = 2
    PHYSICIAN = 3
  
    #the iterable
    ROLE_CHOICES = (
         ( CUSTOMER, user_group_names[0]),
         (TELEHEALTHWORKER, user_group_names[1]),
         (PHYSICIAN, user_group_names[2]),
     )
  
    id = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, primary_key=True)
  
    def __init__(self, new_id):
        super().__init__()
        self.id = new_id      
    def __str__(self):
        return self.get_id_display()
    def set_role(self, new_id):
        self.id = new_id
        return self          
    def set_role_from_name(self, role_name):
        self = Role(Role.CUSTOMER)
        if role_name == user_group_names[1]:
            return Role(Role.TELEHEALTHWORKER)
        if role_name == user_group_names[2]:
            return Role(Role.PHYSICIAN)
        return self   

    
class MyUser(AbstractUser):
    roles = models.ManyToManyField(Role) # user can have multiple major roles
    current_role = models.ForeignKey(Role, on_delete=models.PROTECT, related_name='current_role', null=True) # however, user can only be in one of the major roles at a time; many-to-one
    
    # choose the active group
    # cannot seem to set default value to customer here. Move it to on-first save
    current_group = models.ForeignKey(Group, on_delete=models.PROTECT, related_name='current_group', null=True) 
    
    #one-to-one because of the uniqueness of each detail
    # customer_details = models.OneToOneField(CustomerDetails, on_delete=models.CASCADE, null=True, blank=True)
    # telehealthworker_details = models.OneToOneField(TeleHealthWorkerDetails, on_delete=models.CASCADE, null=True, blank=True)
    # physician_details = models.OneToOneField(PhysicianDetails, on_delete=models.CASCADE, null=True, blank=True)
     
    def __str__(self): 
        return self.first_name 
    
    # Check if the customer details exist
    def has_customer_details(self):
        return hasattr(self, 'customer_details') and self.customer_details is not None 
    
    # to retrieve name of current role.... for use with medsession/consumer
    def _get_user_current_role(self):
        return self.current_role.__str__()   
    
    # to retrieve name of current group.... for use with medsession/consumer
    def _get_user_current_group(self):
        return self.current_group.__str__()  
    
    def set_current_group(self, current_group):
        self.current_group = current_group
    
    def add_to_user_group(self):
        # To check if the user has any group... can also do "self.current_group.count()" in if statement
        if (not self.groups.filter(name=user_group_names[0]).exists()):
            user_initial_group, _ = Group.objects.get_or_create(name=user_group_names[0]) # initialize to CUSTOMER role
            self.set_current_group(user_initial_group)
            self.groups.add(user_initial_group)        
    
    def save(self, *args, **kwargs):
        ############MAYBE DEPRECATE#########################              
        # if no role (such as first time save), a customer role is created       
        if (self.current_role is None):
            the_current_role = Role(Role.CUSTOMER) # initialize to customer role 
            the_current_role.save()   # save to role if it doesn't exist, otherwise updates
            self.current_role = the_current_role  # save to role if it doesn't exist, otherwise updates
            super().save(*args, **kwargs)  # consider indenting        
        if (self.roles.count() == 0):
            self.roles.add(self.current_role) 
        ####################################################  
            
        self.add_to_user_group()
        super().save(*args, **kwargs) 

  
class CustomerDetails(models.Model):
    # ties the user to this object, related_name is how user object will refer to this e.g. user.customer_details
    user = models.OneToOneField(MyUser, on_delete=models.PROTECT, related_name='customer_details', null=True)
    
    status = models.CharField(max_length=300)
    medical_record_summary = models.CharField(max_length=300)
    insurance_provider_summary = models.CharField(max_length=300)
    payment_profile_summary = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
        
class TeleHealthWorkerDetails(models.Model):
    user = models.OneToOneField(MyUser, on_delete=models.PROTECT, related_name='telehealthworker_details', null=True) # ties the user to this object
    status = models.CharField(max_length=300)
    
class PhysicianDetails(models.Model):
    user = models.OneToOneField(MyUser, on_delete=models.PROTECT, related_name='physician_details', null=True) # ties the user to this object
    status = models.CharField(max_length=300)
