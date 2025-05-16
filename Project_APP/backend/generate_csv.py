import csv
import os
import django
from django.utils.timezone import now

# Configuration Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from Tickets.models import Ticket
from Materiels.models import Materiel

# Map pour encoder les catégories matérielles
categorie_map = {
    "Ordinateur": 0,
    "Imprimante": 1,
    "Ecran": 2,
    "Telephone": 3,
}

script_dir = os.path.dirname(os.path.abspath(__file__))
csv_file_path = os.path.join(script_dir,'Analytics', 'ml', 'data_historique.csv')

with open(csv_file_path, mode='w', newline='', encoding='utf-8') as file:
    fieldnames = ['materiel_id', 'nombre_tickets', 'jours_depuis_dernier_ticket', 'categorie_codee', 'type_panne']
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()

    for materiel in Materiel.objects.all():
        tickets = Ticket.objects.filter(asset=materiel).order_by('-opening_date')
        nb_tickets = tickets.count()

        if tickets.exists():
            dernier_ticket = tickets.first()  # le plus récent
            jours_depuis_dernier = (now() - dernier_ticket.opening_date).days
            type_panne = dernier_ticket.category  # champ direct (ex: 'reseau', 'materiel', etc.)
        else:
            jours_depuis_dernier = 999
            type_panne = "aucune"

        categorie_nom = materiel.__class__.__name__
        categorie_codee = categorie_map.get(categorie_nom, -1)

        writer.writerow({
            'materiel_id': materiel.id,
            'nombre_tickets': nb_tickets,
            'jours_depuis_dernier_ticket': jours_depuis_dernier,
            'categorie_codee': categorie_codee,
            'type_panne': type_panne,
        })

print("✅ Fichier CSV généré avec succès :", csv_file_path)
