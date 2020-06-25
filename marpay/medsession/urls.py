from django.urls import path
from django.conf.urls import include, url
from . import views

# consider changing to marpay
app_name = 'medsession' # if not included, it gives error 'Specifying a namespace in include() without providing an app_name '

urlpatterns = [
    path('', views.MedSessionView.as_view({'get': 'list'}), name='medsession_list'),
    path('<uuid:medsession_id>/', views.MedSessionView.as_view({'get': 'retrieve'}), name='medsession_detail'),    
]