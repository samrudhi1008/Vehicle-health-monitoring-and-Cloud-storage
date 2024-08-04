from rest_framework import viewsets
from rest_framework import generics
from .models import Bike
from .serializers import BikeSerializer, UserSerializer
from register.models import User

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Bike.objects.all()
    serializer_class = BikeSerializer

class BikeListCreateAPIView(generics.ListCreateAPIView):
    queryset = Bike.objects.all()
    serializer_class = BikeSerializer

class BikeDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Bike.objects.all()
    serializer_class = BikeSerializer

class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer