from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.db.models.fields import related
from django.template.defaultfilters import default

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

  def __str__(self):
      return self.get_id_display()
  
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
