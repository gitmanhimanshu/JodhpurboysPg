from django.urls import path
from . import views

urlpatterns = [
    path('chat/', views.chat, name='ai_chat'),
    path('initialize/', views.initialize_data, name='initialize_data'),
]
