from django.core.management.base import BaseCommand
from ...prediction_handler import PredictionHandler

class Command(BaseCommand):
    help = 'Met à jour le système de prédiction et génère des prédictions pour tous les matériels'

    def add_arguments(self, parser):
        parser.add_argument(
            '--train-only',
            action='store_true',
            help='Mettre à jour le CSV et entraîner le modèle sans générer de prédictions',
        )
        parser.add_argument(
            '--predict-only',
            action='store_true',
            help='Générer uniquement des prédictions sans mettre à jour le modèle',
        )

    def handle(self, *args, **options):
        self.stdout.write("Démarrage de la mise à jour du système de prédiction...")
        
        if options['train_only']:
            # Mettre à jour uniquement le CSV et le modèle
            PredictionHandler.generer_csv()
            self.stdout.write("CSV généré avec succès")
            
            PredictionHandler.entrainer_modele()
            self.stdout.write("Modèle entraîné avec succès")
        
        elif options['predict_only']:
            # Générer uniquement des prédictions
            predictions = PredictionHandler.predire_pour_tous_materiels()
            self.stdout.write(f"Prédictions générées pour {len(predictions)} matériels")
        
        else:
            # Mettre à jour l'ensemble du système
            if PredictionHandler.mettre_a_jour_systeme():
                self.stdout.write(self.style.SUCCESS("Mise à jour du système de prédiction terminée avec succès"))
            else:
                self.stdout.write(self.style.ERROR("Échec de la mise à jour du système de prédiction"))