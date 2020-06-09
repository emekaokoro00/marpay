from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User

# Create your models here.
class Role(models.Model):
  CUSTOMER = 1
  TELEHEALTHWORKER = 2
  PHYSICIAN = 3
  ROLE_CHOICES = (
      ( CUSTOMER, 'customer'),
      (TELEHEALTHWORKER, 'telehealthworker'),
      (PHYSICIAN, 'physician'),
  )
  
  id = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, primary_key=True)

  def __str__(self):
      return self.get_id_display()
  
class MyUserDetails(models.Model):
    medical_record_summary = models.CharField(max_length=300)
    insurance_provider_summary = models.CharField(max_length=300)
    payment_profile_summary = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    
class MyUser(AbstractUser):
    roles = models.ManyToManyField(Role)
    # user_details = models.ForeignKey(MyUserDetails, on_delete=models.CASCADE, default=1)
