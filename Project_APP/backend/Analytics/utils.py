import joblib
from datetime import datetime
from Analytics.models import MaintenancePrediction, PredictionModel
from Tickets.models import Ticket

model = joblib.load(r'C:\Users\hp\Desktop\Project_PFA\prediction_panne_model.pkl')  # adapte le chemin

def predire_panne(materiel):
    tickets = Ticket.objects.filter(asset=materiel)
    nb_tickets = tickets.count()
    jours_dernier = (datetime.now() - tickets.latest('opening_date').opening_date).days if tickets.exists() else 999
    categorie = 1  # à remplacer par le vrai code de catégorie

    features = [[nb_tickets, jours_dernier, categorie]]
    prediction = model.predict_proba(features)[0][1]

    MaintenancePrediction.objects.create(
        asset=materiel,
        predicted_issue="Panne probable",
        probability=prediction,
        model_used=PredictionModel.objects.first( )
    )
