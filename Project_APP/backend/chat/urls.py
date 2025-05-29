from django.urls import path
from . import views

app_name = 'chat'

urlpatterns = [
    path('api/', views.ChatView.as_view(), name='chat_api'),
]
