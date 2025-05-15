# apps/users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

class Department(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class Service(models.Model):
    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='services')
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.department.name})"

class App_User(AbstractUser):
    password = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    email = models.CharField(max_length=100)
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True)
    role = models.CharField(max_length=20, choices=[
        ('admin', 'Administrateur'),
        ('technicien', 'Technicien'),
        ('utilisateurNormal', 'UtilisateurNormal')
    ])
    avatar = models.ImageField(upload_to='avatars/', default='default_avatar.png')
    def __str__(self):
        return self.username
