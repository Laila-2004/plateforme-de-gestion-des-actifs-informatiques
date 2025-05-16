import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
# Charger les données
data_file_path = os.path.join(script_dir, 'data_historique.csv')
data = pd.read_csv(data_file_path)

# Préparation des features et de la target
X = data[['nombre_tickets', 'jours_depuis_dernier_ticket', 'categorie_codee']]
y = data['type_panne']

# Encoder les types de pannes en labels numériques
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Entraîner le modèle
model = RandomForestClassifier()
model.fit(X, y_encoded)


# Construire les chemins complets pour sauvegarder les fichiers
model_path = os.path.join(script_dir, 'prediction_type_panne_model.pkl')
encoder_path = os.path.join(script_dir, 'label_encoder.pkl')

# Sauvegarder le modèle et l’encodeur dans le répertoire courant
joblib.dump(model, model_path)
joblib.dump(le, encoder_path)
