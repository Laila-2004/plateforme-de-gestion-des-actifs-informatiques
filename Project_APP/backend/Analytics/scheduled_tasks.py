from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from django.conf import settings
import logging
from django.utils import timezone
from datetime import timedelta
import sys

logger = logging.getLogger('scheduled_tasks')

def start():
    """Démarre les tâches planifiées pour la mise à jour du système de prédiction"""
    try:
        # Importer localement pour éviter les importations circulaires
        from Analytics.prediction_handler import PredictionHandler
        
        # Mettre à jour le système de prédiction
        logger.info("Exécution de la tâche planifiée: mise à jour du système de prédiction")
        PredictionHandler.mettre_a_jour_systeme()
        
        now = timezone.now()
        logger.info(f"Tâche planifiée exécutée avec succès à {now}")
    except Exception as e:
        logger.error(f"Erreur lors de l'exécution de la tâche planifiée: {str(e)}")

def init_scheduler():
    """Initialise le planificateur de tâches"""
    try:
        scheduler = BackgroundScheduler()
        scheduler.add_jobstore(DjangoJobStore(), "default")
        
        # Planifier la mise à jour hebdomadaire (tous les lundis à 3h du matin)
        scheduler.add_job(
            start,
            'cron',
            day_of_week='mon',
            hour=3,
            minute=0,
            id="update_prediction_system",
            replace_existing=True
        )
        
        # Démarrer le planificateur si l'application est exécutée en mode serveur
        # (éviter de le démarrer lors des migrations, etc.)
        if 'runserver' in sys.argv or settings.DEBUG is False:
            scheduler.start()
            logger.info("Planificateur de tâches démarré")
        
        return scheduler
    except Exception as e:
        logger.error(f"Erreur lors de l'initialisation du planificateur: {str(e)}")
        return None

# Le planificateur est démarré dans apps.py lors du chargement de l'application
scheduler = init_scheduler()