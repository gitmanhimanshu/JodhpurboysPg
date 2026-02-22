from rest_framework import serializers
from .models import User

class LoginSerializer(serializers.Serializer):
    """Simple login serializer with email and password"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'mobile', 'first_name', 'last_name', 
                  'father_name', 'aadhar', 'address', 'photo_url', 'aadhar_photo_url']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            mobile=validated_data['mobile'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            father_name=validated_data.get('father_name', ''),
            aadhar=validated_data.get('aadhar', ''),
            address=validated_data.get('address', ''),
            photo_url=validated_data.get('photo_url', ''),
            aadhar_photo_url=validated_data.get('aadhar_photo_url', ''),
            is_resident=True
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    isAdmin = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'mobile', 'first_name', 'last_name', 
                  'father_name', 'aadhar', 'address', 'is_resident', 'isAdmin',
                  'photo_url', 'aadhar_photo_url']
    
    def get_isAdmin(self, obj):
        from django.conf import settings
        return obj.email in settings.ADMIN_USERS

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)

class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)
    new_password = serializers.CharField(min_length=6)
