from django.urls import reverse_lazy, reverse
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.shortcuts import render
from django.views.generic.base import TemplateView, View
from django.views.generic.edit import FormView, CreateView, UpdateView
from django.views.generic.detail import DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import MyUser, Role
from business_logic.mvt_helper.multiforms import MultipleFormsView
from .forms import SignUpForm, MyUserUpdateForm, CustomerDetailsUpdateForm


# Create your views here.

class TestPageView(TemplateView): 
    template_name = 'testpage.html'
    
class RegisterTHWConfirmView(UpdateView): 
    template_name = 'myuser/myuser_register_thw_confirm.html'
    form_class = MyUserUpdateForm
    
    def get_object(self):
        myuser = self.request.user
        thw_role = Role(Role.TELEHEALTHWORKER)
        if thw_role not in myuser.roles.all():
            thw_role.save()
            myuser.roles.add(thw_role)
        # add else statement, already a telehealth worker
        else:
            myuser.roles.remove(thw_role)
        # context['is_thw'] = thw_role in myuser.roles.all()
        myuser.save()
        return myuser

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        myuser = self.request.user  
        thw_role = Role(Role.TELEHEALTHWORKER)      
        context['is_thw'] = thw_role in myuser.roles.all()
        return context
    
# class LoginPageView(TemplateView):
#     template_name = "registration/login.html"
#     def post(self, request, **kwargs):     
#         print(request)

def register_thw(request):
    if request.method == 'POST':
        myuser = request.user
        myuser.roles.add(Role.TELEHEALTHWORKER)   
        myuser.save()   
    return render(request, 'myuser/myuser_register_thw_confirm.html')

class SignUpView(CreateView):
    form_class = SignUpForm
    success_url = reverse_lazy('home')
    template_name = 'signup.html'    
    
class MyUserDetailView(LoginRequiredMixin, DetailView):
    model = MyUser
    
    def get_object(self):
        return self.request.user
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        thw_role = Role(Role.TELEHEALTHWORKER)
        context['is_thw'] = thw_role in self.request.user.roles.all()
        return context
 
 
class MyUserCustomerDetailsUpdateView(UpdateView):
    template_name = 'myuser/myuser_update.html'
    template_redirect = 'myuser/myuser_detail.html'
    # model = MyUser
    form_class = MyUserUpdateForm
    second_form_class = CustomerDetailsUpdateForm

    def get_object(self):
        try:
            myuser = self.request.user
        except MyUser.DoesNotExist:
            raise Http404('User not found!')
        return myuser

    def get_context_data(self, **kwargs):
        context = super(MyUserCustomerDetailsUpdateView, self).get_context_data(**kwargs)
        if 'myuser_update_form' not in context:
            context['myuser_update_form'] = \
                self.form_class(initial={'first_name': self.request.user.first_name, 'last_name': self.request.user.last_name})
        if 'customer_details_update_form' not in context:
            context['customer_details_update_form'] = \
                self.second_form_class(initial={'medical_record_summary': self.request.user.customer_details.medical_record_summary, 'insurance_provider_summary': self.request.user.customer_details.insurance_provider_summary})
        return context

    def get(self, request, *args, **kwargs):
        self.object = self.get_object() # assign the object to the view
        return render(request, self.template_name, self.get_context_data())
        
    def form_invalid(self, **kwargs):
        return self.render_to_response(self.get_context_data(**kwargs))

    def post(self, request, *args, **kwargs):
        ctxt = {}
        
        # get the user instance
        self.object = self.get_object()
                
        customer_details_update_form = CustomerDetailsUpdateForm(request.POST, instance=request.user.customer_details)
        myuser_update_form = MyUserUpdateForm(request.POST, instance=request.user)
        
        if customer_details_update_form.is_valid() and myuser_update_form.is_valid():
            # Prepare the user model, but don't commit it to the database just yet.              
            myuser = myuser_update_form.save(commit=False)
            # Add the location ForeignKey by saving the secondary form we setup
            myuser.customer_details = customer_details_update_form.save()
    
            # Save the main object and continue on our merry way.
            myuser.save()
            
        return render(request, self.template_redirect, self.get_context_data(**ctxt))
    
   
# class MyUserUpdateView(LoginRequiredMixin, MultiFormsView):
#     model = MyUser    
#     form_class = MyUserUpdateForm    
#     # suffix should match with latter part of actual html file 
#     # or use # template_name = 'myuser/myuser_update.html'
#     template_name_suffix = '_update' 
#        
#     def get_object(self):
#         return self.request.user  
# 
#     def form_valid(self, form):
#         form.save(self.request.user)
#         return super().form_valid(form)
# 
#     def get_success_url(self, *args, **kwargs):
#         return reverse_lazy("myuser_detail")

