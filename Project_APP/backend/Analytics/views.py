from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Materiels.models import Materiel
from .utils import predire_type_panne
from rest_framework.generics import ListAPIView
from .models import MaintenancePrediction
from .serializers import MaintenancePredictionSerializer

class PredictPanneAPIView(APIView):
    def post(self, request, asset_id):
        try:
            materiel = Materiel.objects.get(id=asset_id)
            print(f"Début prédiction pour materiel {materiel.id}")
            predire_type_panne(materiel)
            print("Prédiction effectuée")
            return Response({"message": "Prédiction effectuée avec succès."})
        except Materiel.DoesNotExist:
            return Response({"error": "Matériel introuvable"}, status=404)
        
        
class MaintenancePredictionListAPIView(ListAPIView):
    queryset = MaintenancePrediction.objects.all().order_by('-prediction_date')
    serializer_class = MaintenancePredictionSerializer