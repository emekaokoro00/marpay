from django.urls import path
from . import views

urlpatterns = [
    path('api/customer/', views.CustomerListCreate.as_view() ),
]