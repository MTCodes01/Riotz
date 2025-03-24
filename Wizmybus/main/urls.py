from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('buses/', views.get_buses_data, name='get_buses_data')
]