import csv
import os
import django
from django.utils.timezone import now

# Configuration Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")  # adapte le nom si nécessaire
django.setup()

from Tickets.models import Ticket  # adapte "app" selon le nom réel de ton app
from Materiels.models import Materiel
# Dictionnaire pour encoder la catégorie
categorie_map = {
    "Ordinateur": 0,
    "Imprimante": 1,
    "Ecran": 2,
    "Telephone": 3,
}

# Chemin du fichier CSV à générer
csv_file_path = "data_historique.csv"

# Ouverture du fichier CSV en écriture
with open(csv_file_path, mode='w', newline='', encoding='utf-8') as file:
    fieldnames = ['materiel_id', 'nombre_tickets', 'jours_depuis_dernier_ticket', 'categorie_codee', 'panne_probable']
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()

    for materiel in Materiel.objects.all():
        # Récupérer les tickets liés à ce matériel
        tickets = Ticket.objects.filter(asset=materiel)
        nb_tickets = tickets.count()

        if tickets.exists():
            dernier_ticket = tickets.latest('opening_date')
            jours_depuis_dernier = (now() - dernier_ticket.opening_date).days
        else:
            jours_depuis_dernier = 999  # ou une grande valeur par défaut

        # Déduire la catégorie à partir du nom de la classe
        categorie_nom = materiel.__class__.__name__
        categorie = categorie_map.get(categorie_nom, -1)  # -1 si non trouvée

        # Exemple simple de logique de panne
        panne_probable = 1 if nb_tickets >= 3 else 0

        writer.writerow({
            'materiel_id': materiel.id,
            'nombre_tickets': nb_tickets,
            'jours_depuis_dernier_ticket': jours_depuis_dernier,
            'categorie_codee': categorie,
            'panne_probable': panne_probable,
        })

print("✅ Fichier CSV généré avec succès :", csv_file_path)
