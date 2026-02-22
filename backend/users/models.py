from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta
import random

class User(AbstractUser):
    mobile = models.CharField(max_length=15, unique=True)
    father_name = models.CharField(max_length=100, blank=True)
    aadhar = models.CharField(max_length=12, blank=True)
    address = models.TextField(blank=True)
    is_resident = models.BooleanField(default=False)
    photo_url = models.URLField(max_length=500, blank=True, null=True)
    aadhar_photo_url = models.URLField(max_length=500, blank=True, null=True)
    
    def __str__(self):
        return self.email


class OTPVerification(models.Model):
    """Store OTP for email verification and password reset"""
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=[
        ('password_reset', 'Password Reset'),
        ('email_verification', 'Email Verification'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email', 'purpose', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.email} - {self.purpose} - {self.otp}"
    
    @staticmethod
    def generate_otp():
        """Generate a 6-digit OTP"""
        return str(random.randint(100000, 999999))
    
    @classmethod
    def create_otp(cls, email, purpose='password_reset'):
        """Create new OTP for email and purpose"""
        otp = cls.generate_otp()
        verification = cls.objects.create(
            email=email,
            otp=otp,
            purpose=purpose
        )
        return verification
    
    def is_valid(self):
        """Check if OTP is still valid (10 minutes) and not used for password reset"""
        # For password reset, once verified, it can be used once more for the actual reset
        # After that, it should be deleted or marked as used
        expiry_time = self.created_at + timedelta(minutes=10)
        return timezone.now() <= expiry_time
    
    @classmethod
    def verify_otp(cls, email, otp, purpose='password_reset', mark_verified=True):
        """Verify OTP for given email and purpose"""
        try:
            # Look for both verified and unverified OTPs
            verification = cls.objects.filter(
                email=email,
                otp=otp,
                purpose=purpose
            ).latest('created_at')
            
            if verification.is_valid():
                if mark_verified and not verification.is_verified:
                    verification.is_verified = True
                    verification.save()
                return True, verification
            else:
                return False, "OTP has expired"
        except cls.DoesNotExist:
            return False, "Invalid OTP"
    
    @classmethod
    def cleanup_old_otps(cls):
        """Delete OTPs older than 24 hours"""
        cutoff_time = timezone.now() - timedelta(hours=24)
        cls.objects.filter(created_at__lt=cutoff_time).delete()
