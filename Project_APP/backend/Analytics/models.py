from django.db import models
from Materiels.models import Materiel

class PredictionModel(models.Model):
    name = models.CharField(max_length=100)
    model_file = models.FileField(upload_to='models/')
    created_at = models.DateTimeField(auto_now_add=True)

class MaintenancePrediction(models.Model):
    asset = models.ForeignKey(Materiel, on_delete=models.CASCADE)
    predicted_issue = models.CharField(max_length=200)
    probability = models.FloatField()
    prediction_date = models.DateTimeField(auto_now_add=True)
    model_used = models.ForeignKey(PredictionModel, on_delete=models.SET_NULL, null=True)
