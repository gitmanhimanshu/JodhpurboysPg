from django.urls import path
from .views import LeadCreateView, LeadListView

urlpatterns = [
    path('create/', LeadCreateView.as_view(), name='lead_create'),
    path('all/', LeadListView.as_view(), name='all_leads'),
]
