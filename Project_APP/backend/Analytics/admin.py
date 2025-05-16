from django.contrib import admin
from .models import MaintenancePrediction,PredictionModel
# Register your models here.
admin.site.register(PredictionModel)
admin.site.register(MaintenancePrediction)