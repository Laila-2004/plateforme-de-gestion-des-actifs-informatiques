import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# 🔸 Remplace ceci par ton vrai dataset
data = pd.read_csv(r'Project_APP\backend\data_historique.csv')

X = data[['nombre_tickets', 'jours_depuis_dernier_ticket', 'categorie_codee']]
y = data['panne_probable']  # 1 = oui, 0 = non

model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, 'prediction_panne_model.pkl')
