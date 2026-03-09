from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from datetime import datetime
import sys

def health_check(request):
    """Health check endpoint"""
    health_data = {
        'status': 'healthy',
        'message': 'Server is running',
        'timestamp': datetime.now().isoformat(),
        'python_version': sys.version,
        'django_version': '5.1.5'
    }
    
    # Print to console for debugging
    print("=" * 50)
    print("HEALTH CHECK REQUEST")
    print("=" * 50)
    print(f"Status: {health_data['status']}")
    print(f"Message: {health_data['message']}")
    print(f"Timestamp: {health_data['timestamp']}")
    print(f"Python Version: {health_data['python_version']}")
    print("=" * 50)
    
    return JsonResponse(health_data)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/users/', include('users.urls')),
    path('api/leads/', include('leads.urls')),
]
