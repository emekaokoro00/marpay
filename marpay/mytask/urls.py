from django.urls import path
from . import views
  

app_name = 'mytask' # if not included, it gives error 'Specifying a namespace in include() without providing an app_name '


urlpatterns = [    
    #-----------API CALLS-----------------------------------------------------------------------------------------------------------------------------------------------    
           
    path('', views.run_task, name='run_task'), 
    path('<task_id>/', views.get_status, name='get_status'), 
]