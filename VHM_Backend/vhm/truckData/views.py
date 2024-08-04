from rest_framework import viewsets
from .models import Truck
from .serializers import TruckSerializer

class TruckViewSet(viewsets.ModelViewSet):
    queryset = Truck.objects.all()
    serializer_class = TruckSerializer
