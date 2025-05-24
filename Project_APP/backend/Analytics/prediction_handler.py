import os
import csv
import logging
import joblib
import pandas as pd
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from django.utils.timezone import now
from django.db import transaction
from django.core.management.base import BaseCommand

# Importer les modèles Django nécessaires
from Tickets.models import Ticket
from Materiels.models import Materiel
from .models import PredictionModel, MaintenancePrediction
# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='maintenance_prediction.log'
)
logger = logging.getLogger('maintenance_prediction')

# Obtenir le chemin du répertoire du script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.join(SCRIPT_DIR, 'ml')
os.makedirs(ML_DIR, exist_ok=True)  # Créer le répertoire ML s'il n'existe pas

# Fichiers de données et modèles
CSV_FILE_PATH = os.path.join(ML_DIR, 'data_historique.csv')
MODEL_PATH = os.path.join(ML_DIR, 'prediction_type_panne_model.pkl')
ENCODER_PATH = os.path.join(ML_DIR, 'label_encoder.pkl')

# Map pour encoder les catégories matérielles
CATEGORIE_MAP = {
    "Ordinateur": 0,
    "Imprimante": 1,
    "Ecran": 2,
    "Telephone": 3,
}

class PredictionHandler:
    """Classe pour gérer la prédiction des pannes et l'entraînement du modèle"""
    
    @staticmethod
    def generer_csv():
        """Génère le CSV avec les données historiques des tickets"""
        try:
            logger.info("Génération du fichier CSV des données historiques...")
            
            with open(CSV_FILE_PATH, mode='w', newline='', encoding='utf-8') as file:
                fieldnames = ['materiel_id', 'nombre_tickets', 'jours_depuis_dernier_ticket', 'categorie_codee', 'type_panne']
                writer = csv.DictWriter(file, fieldnames=fieldnames)
                writer.writeheader()

                for materiel in Materiel.objects.all():
                    tickets = Ticket.objects.filter(asset=materiel).order_by('-opening_date')
                    nb_tickets = tickets.count()

                    if tickets.exists():
                        dernier_ticket = tickets.first()  # le plus récent
                        jours_depuis_dernier = (now() - dernier_ticket.opening_date).days
                        type_panne = dernier_ticket.category
                    else:
                        jours_depuis_dernier = 999
                        type_panne = "aucune"

                    categorie_nom = materiel.__class__.__name__
                    categorie_codee = CATEGORIE_MAP.get(categorie_nom, -1)

                    writer.writerow({
                        'materiel_id': materiel.id,
                        'nombre_tickets': nb_tickets,
                        'jours_depuis_dernier_ticket': jours_depuis_dernier,
                        'categorie_codee': categorie_codee,
                        'type_panne': type_panne,
                    })
            
            logger.info(f"Fichier CSV généré avec succès: {CSV_FILE_PATH}")
            return True
        except Exception as e:
            logger.error(f"Erreur lors de la génération du CSV: {str(e)}")
            return False

    @staticmethod
    def entrainer_modele():
        """Entraîne le modèle de prédiction des pannes"""
        try:
            logger.info("Entraînement du modèle de prédiction...")
            
            # Vérifier si le fichier CSV existe
            if not os.path.exists(CSV_FILE_PATH):
                logger.error("Le fichier CSV n'existe pas. Génération du CSV requise.")
                if not PredictionHandler.generer_csv():
                    return False
            
            # Charger les données
            data = pd.read_csv(CSV_FILE_PATH)
            
            # S'assurer qu'il y a suffisamment de données pour entraîner
            if len(data) < 5:  # Seuil arbitraire, à ajuster selon les besoins
                logger.warning("Pas assez de données pour entraîner un modèle fiable")
                return False
            
            # Préparation des features et de la target
            X = data[['nombre_tickets', 'jours_depuis_dernier_ticket', 'categorie_codee']]
            y = data['type_panne']

            # Encoder les types de pannes en labels numériques
            le = LabelEncoder()
            y_encoded = le.fit_transform(y)

            # Entraîner le modèle avec plus de paramètres pour améliorer la performance
            model = RandomForestClassifier(
                n_estimators=100,
                max_depth=None,
                min_samples_split=2,
                min_samples_leaf=1,
                random_state=42,
                class_weight='balanced'
            )
            model.fit(X, y_encoded)

            # Sauvegarder le modèle et l'encodeur
            joblib.dump(model, MODEL_PATH)
            joblib.dump(le, ENCODER_PATH)
            
            # Créer ou mettre à jour l'entrée du modèle dans la base de données
            with transaction.atomic():
                model_name = f"PannePredictionModel_{datetime.now().strftime('%Y%m%d')}"
                prediction_model, created = PredictionModel.objects.get_or_create(
                    name=model_name,
                    defaults={'model_file': MODEL_PATH}
                )
                if not created:
                    prediction_model.model_file = MODEL_PATH
                    prediction_model.save()
            
            logger.info(f"Modèle entraîné et sauvegardé avec succès: {MODEL_PATH}")
            return True
        except Exception as e:
            logger.error(f"Erreur lors de l'entraînement du modèle: {str(e)}")
            return False

    @staticmethod
    def charger_modele():
        """Charge le modèle entraîné et l'encodeur"""
        try:
            # Vérifier si les fichiers existent
            if not (os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH)):
                logger.warning("Modèle ou encodeur non trouvé. Entraînement du modèle requis.")
                if not PredictionHandler.entrainer_modele():
                    raise FileNotFoundError("Impossible d'entraîner ou de charger le modèle")
            
            model = joblib.load(MODEL_PATH)
            label_encoder = joblib.load(ENCODER_PATH)
            return model, label_encoder
        except Exception as e:
            logger.error(f"Erreur lors du chargement du modèle: {str(e)}")
            raise

    @staticmethod
    def predire_type_panne(materiel):
        """
        Prédit le type de panne pour un matériel donné
        Amélioration: ajout de la gestion des erreurs et du logging
        """
        try:
            # Charger le modèle et l'encodeur
            model, label_encoder = PredictionHandler.charger_modele()
            
            # Obtenir les données du matériel
            tickets = Ticket.objects.filter(asset=materiel)
            nb_tickets = tickets.count()
            
            if tickets.exists():
                jours_dernier = (now() - tickets.latest('opening_date').opening_date).days
                # Ajouter un facteur de pondération basé sur la fréquence des tickets récents
                tickets_recents = tickets.filter(opening_date__gte=now() - timedelta(days=90)).count()
                poids_recents = tickets_recents / max(1, nb_tickets)
            else:
                jours_dernier = 999
                poids_recents = 0
            
            categorie_nom = materiel.__class__.__name__
            categorie_codee = CATEGORIE_MAP.get(categorie_nom, -1)
            
            # Features avec pondération (nous n'utilisons pas directement le poids car le modèle n'a pas été entraîné avec)
            features = [[nb_tickets, jours_dernier, categorie_codee]]

            # Prédiction
            prediction_encoded = model.predict(features)[0]
            prediction_label = label_encoder.inverse_transform([prediction_encoded])[0]
            probas = model.predict_proba(features)[0]
            prediction_proba = probas.max()
            
            # Ajustement de la probabilité basé sur les tickets récents (facteur de confiance)
            # Si beaucoup de tickets récents, augmenter légèrement la confiance
            adjusted_proba = min(0.99, prediction_proba * (1 + (poids_recents * 0.1)))
            
            # Obtenir le modèle de prédiction enregistré
            prediction_model = PredictionModel.objects.first()
            
            # Créer la prédiction
            with transaction.atomic():
                prediction = MaintenancePrediction.objects.create(
                    asset=materiel,
                    predicted_issue=prediction_label,
                    probability=adjusted_proba,
                    model_used=prediction_model
                )
            
            logger.info(f"Prédiction créée pour {materiel}: {prediction_label} (probabilité: {adjusted_proba:.2f})")
            return prediction
        except Exception as e:
            logger.error(f"Erreur lors de la prédiction pour {materiel}: {str(e)}")
            return None

    @staticmethod
    def predire_pour_tous_materiels():
        """Effectue des prédictions pour tous les matériels"""
        try:
            logger.info("Création de prédictions pour tous les matériels...")
            predictions = []
            materiels = Materiel.objects.all()
            
            for materiel in materiels:
                prediction = PredictionHandler.predire_type_panne(materiel)
                if prediction:
                    predictions.append(prediction)
            
            logger.info(f"Prédictions créées pour {len(predictions)} matériels sur {materiels.count()}")
            return predictions
        except Exception as e:
            logger.error(f"Erreur lors de la prédiction pour tous les matériels: {str(e)}")
            return []

    @staticmethod
    def mettre_a_jour_systeme():
        """Met à jour l'ensemble du système de prédiction"""
        logger.info("Mise à jour complète du système de prédiction...")
        
        # Générer le CSV
        if not PredictionHandler.generer_csv():
            logger.error("Échec de la génération du CSV")
            return False
        
        # Entraîner le modèle
        if not PredictionHandler.entrainer_modele():
            logger.error("Échec de l'entraînement du modèle")
            return False
        
        # Prédire pour tous les matériels
        predictions = PredictionHandler.predire_pour_tous_materiels()
        if not predictions:
            logger.warning("Aucune prédiction générée")
        
        logger.info("Mise à jour du système de prédiction terminée avec succès")
        return True


class Command(BaseCommand):
    """Commande Django pour mettre à jour le système de prédiction"""
    help = 'Met à jour le système de prédiction de maintenance'

    def handle(self, *args, **options):
        self.stdout.write("Démarrage de la mise à jour du système de prédiction...")
        
        if PredictionHandler.mettre_a_jour_systeme():
            self.stdout.write(self.style.SUCCESS("Mise à jour du système de prédiction terminée avec succès"))
        else:
            self.stdout.write(self.style.ERROR("Échec de la mise à jour du système de prédiction"))