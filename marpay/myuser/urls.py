from django.urls import path
from django.conf.urls import include, url
from django.views.generic.base import TemplateView
from .views import SignUpView, TestPageView, RegisterTHWConfirmView
from . import views

urlpatterns = [
    # path('', LoginPageView.as_view(), name='login'),
    # path('login/', LoginPageView.as_view(), name='login'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('testpage/', TestPageView.as_view(), name='testpage'), 
        
    # path('<pk>/', GeeksDetailView.as_view()), # from a list
    path('profile/', views.MyUserDetailView.as_view(), name='myuser_detail'), 
    # path('update/', views.MyUserUpdateView.as_view(), name='myuser_update'), # 'name' here should match with actual html file
    path('update/', views.MyUserCustomerDetailsView.as_view(), name='myuser_update'),
    path('thw_confirm/', views.RegisterTHWConfirmView.as_view(), name='myuser_register_thw_confirm'), 
    # path('thw_confirm/', views.register_thw, name='myuser_register_thw_confirm'), 
]