from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet
from .views import BikeListCreateAPIView, UserListAPIView
from .views import BikeListCreateAPIView, BikeDetailAPIView, UserListAPIView


router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('bikes/', BikeListCreateAPIView.as_view(), name='bike-list-create'),
    path('users/', UserListAPIView.as_view(), name='user-list'),
    path('bikes/<int:pk>/', BikeDetailAPIView.as_view(), name='bike-detail'),
]
