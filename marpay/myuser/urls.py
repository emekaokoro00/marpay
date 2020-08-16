from django.urls import path
from django.conf.urls import include, url
from django.views.generic.base import TemplateView
from .views import SignUpView, TestPageView
from . import views

from rest_framework import routers   

app_name = 'myuser' # if not included, it gives error 'Specifying a namespace in include() without providing an app_name '

router = routers.DefaultRouter()
router.register(r'', views.MyUserProfileCRUDAPIView, 'myuser')

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('testpage/', TestPageView.as_view(), name='testpage'), 
        
    # 'name=myuser_detail' is the url-link in html page. 'profile/' is what is appended to the browser url. views.MyUserDetailView.as_view() is the views.py function
    # path('<pk>/', GeeksDetailView.as_view()), # from a list
    path('profile/', views.MyUserDetailView.as_view(), name='myuser_detail'), 
    path('update/', views.MyUserCustomerDetailsUpdateView.as_view(), name='myuser_update'),     
    path('thw_confirm/', views.RegisterTHWConfirmView.as_view(), name='myuser_register_thw_confirm'), 
    path('physician_confirm/', views.RegisterPhysicianConfirmView.as_view(), name='myuser_register_physician_confirm'), 
     
    path('get_thw_list/', views.get_thw_list, name='get_thw_list'), # temporary url that automatically adds thw role to customer
    path('get_physician_list/', views.get_physician_list, name='get_physician_list'),   # temporary url that automatically adds physician role to customer
    
    path('start_call/', views.start_call, name='start_call'),
    
    #-----------API CALLS------------------------
    
    # client - > URL -> VIEW (serializer, etc)
           
    path('', include(router.urls)), # TO USE ALL CRUD AT ONCE... The API URLs are now determined automatically by the router.
    # # or indiviually 
    # path('', views.MyUserProfileAPIView.as_view(), name='api_list'),
    # path('<int:pk>/', views.MyUserProfileAPIView.as_view(), name='api_details'),
    # path('<int:pk>/update/', views.MyUserProfilePartialUpdateAPIView.as_view(), name='api_update'),
    
]