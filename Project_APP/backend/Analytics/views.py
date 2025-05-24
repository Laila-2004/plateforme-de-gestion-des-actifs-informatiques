from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import MaintenancePrediction
from .serializers import MaintenancePredictionSerializer
from Materiels.models import Materiel
from .prediction_handler import PredictionHandler

class MaintenancePredictionViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les prédictions de maintenance
    """
    queryset = MaintenancePrediction.objects.all().order_by('-prediction_date')
    serializer_class = MaintenancePredictionSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def update_predictions(self, request):
        """
        Endpoint pour mettre à jour l'ensemble du système de prédiction
        """
        try:
            PredictionHandler.mettre_a_jour_systeme()
            return Response({"message": "Système de prédiction mis à jour avec succès"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def predict_for_asset(self, request):
        """
        Endpoint pour générer une prédiction pour un matériel spécifique
        """
        try:
            asset_id = request.data.get('asset_id')
            if not asset_id:
                return Response({"error": "ID du matériel requis"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                materiel = Materiel.objects.get(id=asset_id)
            except Materiel.DoesNotExist:
                return Response({"error": "Matériel non trouvé"}, status=status.HTTP_404_NOT_FOUND)
            
            prediction = PredictionHandler.predire_type_panne(materiel)
            if prediction:
                serializer = self.get_serializer(prediction)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Échec de la prédiction"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def high_risk_assets(self, request):
        """
        Endpoint pour obtenir la liste des matériels à haut risque de panne
        """
        try:
            # Filtrer les prédictions avec une probabilité élevée (> 70%)
            high_risk = MaintenancePrediction.objects.filter(
            probability__gt=0.7
        ).exclude(
            predicted_issue__iexact="aucune"
        ).order_by('-probability')
            serializer = self.get_serializer(high_risk, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)