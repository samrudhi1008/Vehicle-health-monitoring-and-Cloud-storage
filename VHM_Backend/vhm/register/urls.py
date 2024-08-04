# register/urls.py
from django.shortcuts import render
from django.urls import path
from .views import RegisterUserView, LoginUserView, driver_list, get_user_profile
from . import views
from .views import register

urlpatterns = [
    #path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('admin_dashboard/', lambda request: render(request, 'admin_dashboard.html'), name='admin_dashboard'),
    path('driver_dashboard/', lambda request: render(request, 'driver_dashboard.html'), name='driver_dashboard'),
    path('register/', register, name='register'),
    path('driver-list/', driver_list, name='driver-list'),
    path('api/driver-list/', driver_list, name='driver_list'),
    path('api/user_profile/', get_user_profile, name='user_profile'),
]
