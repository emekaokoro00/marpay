from django.shortcuts import render
from .models import Customer
from .serializers import CustomerSerializer
from rest_framework import generics

# Create your views here.

class CustomerListCreate(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
