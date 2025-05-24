from rest_framework import serializers
from .models import MaintenancePrediction
from Materiels.models import Materiel
from Materiels.serializers import MaterielSerializer

class MaintenancePredictionSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    asset = serializers.PrimaryKeyRelatedField(queryset=Materiel.objects.all())
    asset_details = MaterielSerializer(source='asset', read_only=True)
    class Meta:
        model = MaintenancePrediction
        fields = ['id', 'asset_name', 'predicted_issue', 'probability', 'prediction_date','asset','asset_details']
