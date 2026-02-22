from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.conf import settings
from .models import User, OTPVerification
from .serializers import (
    UserRegistrationSerializer, 
    UserSerializer, 
    PasswordResetRequestSerializer,
    VerifyOTPSerializer,
    PasswordResetConfirmSerializer,
    LoginSerializer
)
from utils.email_service import send_otp_email

class LoginView(APIView):
    """Custom login view that accepts email and password"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            # Get user by email
            user = User.objects.get(email=email)
            
            # Check password
            if user.check_password(password):
                if not user.is_active:
                    return Response({
                        'error': 'Account is disabled'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'user': UserSerializer(user).data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid email or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except User.DoesNotExist:
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        """Update user profile (including photo)"""
        user = request.user
        
        # Update allowed fields
        allowed_fields = ['photo_url', 'aadhar_photo_url', 'address', 'mobile']
        for field in allowed_fields:
            if field in request.data:
                setattr(user, field, request.data[field])
        
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data)

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.email in settings.ADMIN_USERS

class AllUsersView(generics.ListAPIView):
    queryset = User.objects.filter(is_resident=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

class PasswordResetRequestView(APIView):
    """Send OTP to user's email"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
            
            # Create OTP verification
            verification = OTPVerification.create_otp(email, purpose='password_reset')
            
            # Send OTP via email
            user_name = f"{user.first_name} {user.last_name}".strip() or user.email
            success, message = send_otp_email(email, verification.otp, user_name)
            
            if success:
                return Response({
                    'message': 'OTP sent to your email',
                    'email': email
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Failed to send OTP'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except User.DoesNotExist:
            # Don't reveal if user exists or not
            return Response({
                'message': 'If this email exists, an OTP has been sent'
            }, status=status.HTTP_200_OK)

class VerifyOTPView(APIView):
    """Verify OTP before allowing password reset"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        
        # Verify OTP
        is_valid, result = OTPVerification.verify_otp(email, otp, purpose='password_reset')
        
        if is_valid:
            return Response({
                'message': 'OTP verified successfully',
                'verified': True
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': result if isinstance(result, str) else 'Invalid or expired OTP',
                'verified': False
            }, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    """Reset password after OTP verification"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']
        
        try:
            user = User.objects.get(email=email)
            
            # Verify OTP one more time (don't mark as verified again)
            is_valid, result = OTPVerification.verify_otp(email, otp, purpose='password_reset', mark_verified=False)
            
            if is_valid:
                # Reset password
                user.set_password(new_password)
                user.save()
                
                # Delete the OTP after successful password reset
                if isinstance(result, OTPVerification):
                    result.delete()
                
                return Response({
                    'message': 'Password reset successful'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': result if isinstance(result, str) else 'Invalid or expired OTP'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except User.DoesNotExist:
            return Response({
                'error': 'Invalid request'
            }, status=status.HTTP_400_BAD_REQUEST)
