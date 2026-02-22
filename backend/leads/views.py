from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.conf import settings
from .models import Lead
from .serializers import LeadSerializer
from utils.email_service import send_lead_notification_email

class LeadCreateView(generics.CreateAPIView):
    serializer_class = LeadSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lead = serializer.save()
        
        # Send email to admin and all admin users
        self.send_email_notification(lead)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def send_email_notification(self, lead):
        # Collect all recipient emails
        recipients = [settings.ADMIN_EMAIL]
        if settings.ADMIN_USERS:
            recipients.extend(settings.ADMIN_USERS)
        
        # Remove duplicates
        recipients = list(set(recipients))
        
        # Format date
        lead_date = lead.created_at.strftime('%d %B %Y, %I:%M %p')
        
        # Send emails via Brevo API
        results = send_lead_notification_email(
            recipients=recipients,
            lead_name=lead.name,
            lead_mobile=lead.mobile,
            lead_date=lead_date
        )
        
        # Log results
        for recipient, success, message in results:
            if success:
                print(f"✓ Lead notification sent to {recipient}")
            else:
                print(f"⚠️ Failed to send to {recipient}: {message}")

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.email in settings.ADMIN_USERS

class LeadListView(generics.ListAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
