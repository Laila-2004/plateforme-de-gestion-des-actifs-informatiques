from rest_framework import viewsets
from .models import Notification
from .serializers import NotificationSerializer
# Create your views here.
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')