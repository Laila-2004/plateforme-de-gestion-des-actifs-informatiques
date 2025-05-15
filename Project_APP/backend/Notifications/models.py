# apps/notifications/models.py
from django.db import models

class Notification(models.Model):
    user = models.ForeignKey('App_Users.App_User', on_delete=models.CASCADE)
    message = models.TextField()
    type = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
