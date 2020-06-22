import os
import json
from django.urls import reverse_lazy, reverse
from django.http import HttpResponseRedirect,  Http404
from django.template import RequestContext
from django.shortcuts import render
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views.generic.base import TemplateView, View
from django.views.generic.edit import FormView, CreateView, UpdateView
from django.views.generic.detail import DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from _datetime import datetime
from .models import MyUser, Role, CustomerDetails
# from business_logic.mvt_helper.multiforms import MultipleFormsView
from .forms import SignUpForm, MyUserUpdateForm, CustomerDetailsUpdateForm
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant



twilio_account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
twilio_api_key_sid = os.environ.get('TWILIO_API_KEY_SID')
twilio_api_key_secret = os.environ.get('TWILIO_API_KEY_SECRET')


# Create your views here.
        
# class LoginPageView(TemplateView):
#     template_name = "registration/login.html"
#     def post(self, request, **kwargs):     
#         print(request)

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
    
class RegisterPhysicianConfirmView(UpdateView): 
    template_name = 'myuser/myuser_register_physician_confirm.html'
    form_class = MyUserUpdateForm
    
    def get_object(self):
        myuser = self.request.user
        physician_role = Role(Role.PHYSICIAN)
        if physician_role not in myuser.roles.all():
            physician_role.save()
            myuser.roles.add(physician_role)
        # add else statement, already a telehealth worker
        else:
            myuser.roles.remove(physician_role)
        # context['is_thw'] = thw_role in myuser.roles.all()
        myuser.save()
        return myuser

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        myuser = self.request.user  
        physician_role = Role(Role.PHYSICIAN)      
        context['is_physician'] = physician_role in myuser.roles.all()
        return context

def register_thw(request):
    if request.method == 'POST':
        myuser = request.user
        myuser.roles.add(Role.TELEHEALTHWORKER)   
        myuser.save()   
    return render(request, 'myuser/myuser_register_thw_confirm.html')

def register_physician(request):
    if request.method == 'POST':
        myuser = request.user
        myuser.roles.add(Role.PHYSICIAN)   
        myuser.save()   
    return render(request, 'myuser/myuser_register_physician_confirm.html')


def get_thw_list(request):
    # if request.method == "GET" and request.is_ajax():
    if request.method == "POST":
        data = dict()
        data['form_is_valid'] = True  
        user_thw_list = MyUser.objects.all().filter(roles=Role(Role.TELEHEALTHWORKER))
        # this takes the list, and the page and passes back to the javascript, which then renders it to the appropriate location and displays
        data['html_user_thw_list'] = render_to_string('myuser/myuser_thw_list.html', {'user_thw_list': user_thw_list }) 
        return JsonResponse(data)
    return JsonResponse({"success":False}, status=400)


def get_physician_list(request):
    # if request.method == "GET" and request.is_ajax():
    if request.method == "POST":
        data = dict()
        data['form_is_valid'] = True  
        user_physician_list = MyUser.objects.all().filter(roles=Role(Role.PHYSICIAN))
        # this takes the list, and the page and passes back to the javascript, which then renders it to the appropriate location and displays
        data['html_user_physician_list'] = render_to_string('myuser/user_physician_list.html', {'user_physician_list': user_physician_list }) 
        return JsonResponse(data)
    return JsonResponse({"success":False}, status=400)

        
def start_call(request):
    username_caller = json.loads(request.body.decode("utf-8")).get('username_caller')
    username_callee = json.loads(request.body.decode("utf-8")).get('username_callee')

    token = AccessToken(twilio_account_sid, twilio_api_key_sid,
                        twilio_api_key_secret, identity=username_caller)
    token.add_grant(VideoGrant(room='My Room'))
    # token.add_grant(VideoGrant(room=username_caller + '_' + username_callee))

    return JsonResponse({'token': token.to_jwt().decode()})


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
        physician_role = Role(Role.PHYSICIAN)
        context['is_thw'] = thw_role in self.request.user.roles.all()
        context['is_physician'] = physician_role in self.request.user.roles.all()
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
        
        thw_role = Role(Role.TELEHEALTHWORKER)    
        physician_role = Role(Role.PHYSICIAN)    
        if 'is_thw' not in context:  
            context['is_thw'] = thw_role in self.request.user.roles.all()
        if 'is_physician' not in context:  
            context['is_physician'] = physician_role in self.request.user.roles.all()
        
        if 'myuser_update_form' not in context:
            context['myuser_update_form'] = \
                self.form_class(initial={'first_name': self.request.user.first_name, 'last_name': self.request.user.last_name})
        if 'customer_details_update_form' not in context:
            self.request.user = return_user_with_instance_or_new_customer_details(self.request.user)
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

def return_user_with_instance_or_new_customer_details(the_user):    
    if not the_user.has_customer_details():
        the_customer_details = CustomerDetails(user = the_user, status = "", medical_record_summary = "", insurance_provider_summary = "", payment_profile_summary = "", created_at = datetime.now) # initialize to customer details
        the_customer_details.save()
        the_user.customer_details = the_customer_details
    return the_user

