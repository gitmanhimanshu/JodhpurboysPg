from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView,
    UserRegistrationView, 
    UserProfileView, 
    AllUsersView,
    PasswordResetRequestView,
    VerifyOTPView,
    PasswordResetConfirmView
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('all/', AllUsersView.as_view(), name='all_users'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
