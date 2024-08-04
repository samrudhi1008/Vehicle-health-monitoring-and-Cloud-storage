# register/views.py
from django.http import JsonResponse
from django.shortcuts import redirect, render
from rest_framework import generics
from django.contrib.auth.models import User

from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework.response import Response

from bikeData.models import Bike
from carData.models import Car
from truckData.models import Truck
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserProfileSerializer
from django.http import JsonResponse
from register.models import UserProfile
from bikeData.models import Bike
from carData.models import Car
from truckData.models import Truck

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class LoginUserView(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            return Response({'status': 'Login successful'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    
def login_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            if user.username == 'Admin':
                return redirect('admin_dashboard')
            else:
                return redirect('driver_dashboard')
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    
    return render(request, 'login.html')

@api_view(['POST'])
def register(request):
    serializer = UserProfileSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    print(serializer.errors)  # Add this line to debug
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)









@api_view(['GET'])
def driver_list(request):
    try:
        drivers = UserProfile.objects.all()
        data = []

        for driver in drivers:
            # Fetch vehicles assigned to the driver
            bikes = Bike.objects.filter(assigned_driver=driver.user.username)
            cars = Car.objects.filter(assigned_driver=driver.user.username)
            trucks = Truck.objects.filter(assigned_driver=driver.user.username)

            # Add bike vehicles
            for bike in bikes:
                data.append({
                    'username': driver.user.username,
                    'contact_no': driver.contact_no,
                    'email': driver.user.email,
                    'vehicle_number': bike.number_plate,
                    'vehicle_type': 'Bike'  # Adding vehicle type
                })

            # Add car vehicles
            for car in cars:
                data.append({
                    'username': driver.user.username,
                    'contact_no': driver.contact_no,
                    'email': driver.user.email,
                    'vehicle_number': car.number_plate,
                    'vehicle_type': 'Car'  # Adding vehicle type
                })

            # Add truck vehicles
            for truck in trucks:
                data.append({
                    'username': driver.user.username,
                    'contact_no': driver.contact_no,
                    'email': driver.user.email,
                    'vehicle_number': truck.number_plate,
                    'vehicle_type': 'Truck'  # Adding vehicle type
                })

        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
class UserProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(user_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)