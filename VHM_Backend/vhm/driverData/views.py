from rest_framework import viewsets
from register.models import UserProfile
from .serializers import DriverSerializer

class DriverViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = DriverSerializer