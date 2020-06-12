from django.urls import path
from django.conf.urls import include, url
from django.views.generic.base import TemplateView
from .views import SignUpView, TestPageView
from . import views

urlpatterns = [
    # path('', LoginPageView.as_view(), name='login'),
    # path('login/', LoginPageView.as_view(), name='login'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('testpage/', TestPageView.as_view(), name='testpage'), 
        
    # path('<pk>/', GeeksDetailView.as_view()), # from a list
    path('profile/', views.MyUserDetailView.as_view(), name='myuser_detail'), 
]