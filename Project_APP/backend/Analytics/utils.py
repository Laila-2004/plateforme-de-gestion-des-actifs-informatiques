import joblib
from datetime import datetime
from .models import MaintenancePrediction,PredictionModel
from Tickets.models import Ticket
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'ml', 'prediction_type_panne_model.pkl')
label_encoder_path = os.path.join(script_dir, 'ml', 'label_encoder.pkl')
model = joblib.load(model_path)
label_encoder = joblib.load(label_encoder_path)

categorie_map = {
    "Ordinateur": 0,
    "Imprimante": 1,
    "Ecran": 2,
    "Telephone": 3,
}

def predire_type_panne(materiel):
    tickets = Ticket.objects.filter(asset=materiel)
    nb_tickets = tickets.count()
    jours_dernier = (datetime.now() - tickets.latest('opening_date').opening_date).days if tickets.exists() else 999
   
    categorie_nom = materiel.__class__.__name__
    categorie_codee = categorie_map.get(categorie_nom, -1)
    categorie = categorie_codee

    features = [[nb_tickets, jours_dernier, categorie]]

    prediction_encoded = model.predict(features)[0]
    prediction_label = label_encoder.inverse_transform([prediction_encoded])[0]
    prediction_proba = model.predict_proba(features)[0].max()  # probabilité de la classe prédite

    MaintenancePrediction.objects.create(
        asset=materiel,
        predicted_issue=prediction_label,
        probability=prediction_proba,
        model_used=PredictionModel.objects.first()
    )


