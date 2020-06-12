from django.urls import reverse_lazy
from django.views.generic.base import TemplateView
from django.views.generic.edit import CreateView, UpdateView
from django.views.generic.detail import DetailView
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .forms import SignUpForm, MyUserUpdateForm
from .models import MyUser
from django.contrib.auth.mixins import LoginRequiredMixin

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
    
    
class MyUserDetailView(LoginRequiredMixin, DetailView):
    model = MyUser
    
    def get_object(self):
        return self.request.user
    
    
class MyUserUpdateView(LoginRequiredMixin, UpdateView):
    model = MyUser
    form_class = MyUserUpdateForm
    
    # suffix should match with latter part of actual html file 
    # or use # template_name = 'myuser/myuser_update.html'
    template_name_suffix = '_update' 
    
    
    def get_object(self):
        return self.request.user    

    def form_valid(self, form):
        form.save(self.request.user)
        return super().form_valid(form)

    def get_success_url(self, *args, **kwargs):
        return reverse_lazy("myuser_detail")

