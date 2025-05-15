# apps/analytics/models.py
from django.db import models

class PredictionModel(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    model_path = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class MaintenancePrediction(models.Model):
    asset = models.ForeignKey('Materiels.Materiel', on_delete=models.CASCADE)
    probability = models.FloatField()
    predicted_issue = models.CharField(max_length=255)
    prediction_date = models.DateTimeField(auto_now_add=True)
    model_used = models.ForeignKey(PredictionModel, on_delete=models.SET_NULL, null=True)