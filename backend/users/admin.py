from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, OTPVerification

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'mobile', 'is_resident', 'is_staff']
    list_filter = ['is_resident', 'is_staff', 'is_active']
    search_fields = ['email', 'mobile', 'first_name', 'last_name']
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('mobile', 'father_name', 'aadhar', 'address', 'is_resident')}),
    )

@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ['email', 'otp', 'purpose', 'is_verified', 'created_at', 'is_valid_display']
    list_filter = ['purpose', 'is_verified', 'created_at']
    search_fields = ['email', 'otp']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    def is_valid_display(self, obj):
        return obj.is_valid()
    is_valid_display.short_description = 'Valid'
    is_valid_display.boolean = True
    
    actions = ['cleanup_old_otps']
    
    def cleanup_old_otps(self, request, queryset):
        OTPVerification.cleanup_old_otps()
        self.message_user(request, "Old OTPs cleaned up successfully")
    cleanup_old_otps.short_description = "Clean up old OTPs (>24 hours)"
