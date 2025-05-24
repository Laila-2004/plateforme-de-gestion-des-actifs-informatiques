from django.apps import AppConfig

class AnalyticsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Analytics'

    def ready(self):
        # Import des tâches planifiées lors du démarrage de l'application
        import Analytics.scheduled_tasks