from django.urls import reverse_lazy
from django.views.generic.base import TemplateView
from django.views.generic.edit import CreateView
from django.views.generic.detail import DetailView
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .forms import SignUpForm
from .models import MyUser

# Create your views here.

# class LoginPageView(TemplateView):
#     template_name = "registration/login.html"
#     def post(self, request, **kwargs):     
#         print(request)
#         return render(request, 'registration/login.html')

class SignUpView(CreateView):
    form_class = SignUpForm
    success_url = reverse_lazy('home')
    template_name = 'signup.html'


class TestPageView(TemplateView): 
    template_name = 'testpage.html'
    
    
class MyUserDetailView(DetailView):
    model = MyUser
    # form_class = MealForm
    # template_name_suffix = '_detail'
    
    def get_object(self):
        return self.request.user

