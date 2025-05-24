from django.db import models
from Materiels.models import Materiel
from django.utils.timezone import now
from django.dispatch import receiver
from django.db.models.signals import post_save
from Tickets.models import Ticket
import logging

logger = logging.getLogger('analytics_models')

class PredictionModel(models.Model):
    name = models.CharField(max_length=100)
    model_file = models.FileField(upload_to='models/')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} ({self.created_at.strftime('%Y-%m-%d')})"

class MaintenancePrediction(models.Model):
    asset = models.ForeignKey(Materiel, on_delete=models.CASCADE, related_name='predictions')
    predicted_issue = models.CharField(max_length=200)
    probability = models.FloatField()
    prediction_date = models.DateTimeField(auto_now_add=True)
    model_used = models.ForeignKey(PredictionModel, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        ordering = ['-prediction_date']
    
    def __str__(self):
        return f"Prédiction pour {self.asset}: {self.predicted_issue} ({self.probability:.2f})"

# Signal pour déclencher la mise à jour des prédictions après création ou modification d'un ticket
@receiver(post_save, sender=Ticket)
def update_predictions_on_ticket_change(sender, instance, created, **kwargs):
    try:
        # Si un nouveau ticket est créé ou si un ticket existant est modifié,
        # nous voulons mettre à jour la prédiction pour le matériel associé
        if instance.asset:
            # Import ici pour éviter les importations circulaires
            from .prediction_handler import PredictionHandler
            
            # Log de l'événement
            action = "créé" if created else "modifié"
            logger.info(f"Ticket {action} pour le matériel {instance.asset} - Mise à jour de la prédiction")
            
            # Mettre à jour la prédiction uniquement pour le matériel concerné
            PredictionHandler.predire_type_panne(instance.asset)
    except Exception as e:
        logger.error(f"Erreur lors de la mise à jour de la prédiction suite à un changement de ticket: {str(e)}")