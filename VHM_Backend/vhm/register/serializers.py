from rest_framework import serializers
from django.contrib.auth.models import User

from bikeData.models import Bike
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}  # Ensure password is write-only

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = ('user', 'age', 'contact_no', 'license_no', 'address')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer().create(user_data)
        UserProfile.objects.create(user=user, **validated_data)
        return user

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bike
        fields = ('model_name', 'number_plate', 'assigned_driver')

class DriverVehicleSerializer(serializers.Serializer):
    username = serializers.CharField(source='user.username')
    contact_no = serializers.CharField(source='user.userprofile.contact_no')
    email = serializers.EmailField(source='user.email')
    vehicle_number = serializers.CharField()

    class Meta:
        fields = ('username', 'contact_no', 'email', 'vehicle_number')

