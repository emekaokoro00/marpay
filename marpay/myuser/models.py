from django.db import models
from django.contrib.auth.models import AbstractUser
from _datetime import datetime

# Create your models here.
class Role(models.Model):
    CUSTOMER = 1
    TELEHEALTHWORKER = 2
    PHYSICIAN = 3
  
    #the enum
    ROLE_CHOICES = (
         ( CUSTOMER, 'customer'),
         (TELEHEALTHWORKER, 'telehealthworker'),
         (PHYSICIAN, 'physician'),
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
  
class CustomerDetails(models.Model):
    status = models.CharField(max_length=300)
    medical_record_summary = models.CharField(max_length=300)
    insurance_provider_summary = models.CharField(max_length=300)
    payment_profile_summary = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
        
class TeleHealthWorkerDetails(models.Model):
    status = models.CharField(max_length=300)
    
class PhysicianDetails(models.Model):
    status = models.CharField(max_length=300)
    
class MyUser(AbstractUser):
    roles = models.ManyToManyField(Role) # user can have multiple major roles
    current_role = models.ForeignKey(Role, on_delete=models.PROTECT, related_name='current_role', null=True) # however, user can only be in one of the major roles at a time; many-to-one
    
    #one-to-one because of the uniqueness of each detail
    customer_details = models.OneToOneField(CustomerDetails, on_delete=models.CASCADE, null=True, blank=True)
    telehealthworker_details = models.OneToOneField(TeleHealthWorkerDetails, on_delete=models.CASCADE, null=True, blank=True)
    physician_details = models.OneToOneField(PhysicianDetails, on_delete=models.CASCADE, null=True, blank=True)
     
    def __str__(self): 
        return self.first_name 
    
    def save(self, *args, **kwargs): 
        # create roles and details if they don't exist
        if (self.customer_details is None):
            self.customer_details = CustomerDetails(status = "", medical_record_summary = "", insurance_provider_summary = "", payment_profile_summary = "", created_at = datetime.now) # initialize to customer details 
        # self.customer_details.save()   # save to customerdetails if it doesn't exist, otherwise updates
            
        if (self.current_role is None):
            self.current_role = Role(Role.CUSTOMER) # initialize to customer role 
            self.current_role.save()   # save to role if it doesn't exist, otherwise updates
        super().save(*args, **kwargs)  # consider indenting
        if (self.roles.count() == 0):
            self.roles.add(self.current_role) 
        
        super().save(*args, **kwargs) 
