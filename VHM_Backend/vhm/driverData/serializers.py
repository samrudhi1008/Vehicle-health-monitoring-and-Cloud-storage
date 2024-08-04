from rest_framework import serializers
from register.models import UserProfile

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user', 'contact_no', 'email']
    
    email = serializers.SerializerMethodField()

    def get_email(self, obj):
        return obj.user.email
