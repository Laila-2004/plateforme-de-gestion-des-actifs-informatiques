from rest_framework import viewsets
from .models import *
from rest_framework.decorators import api_view
from .serializers import OrdinateurSerializer,ImprimentSerializer,TelephoneSerializers,EcrantSerializers, MaterielSerializer, ServeurSerializer, LogicielSerializer, StockageExterneSerializer, RouteurSerializer, PeripheriqueSerializer
from rest_framework.response import Response


from reportlab.lib.pagesizes import A4
from django.http import HttpResponse
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, LongTable


# Create your views here.
class MaterielViewSet(viewsets.ModelViewSet):
    queryset = Materiel.objects.all()
    serializer_class = MaterielSerializer

class OrdinateurViewSet(viewsets.ModelViewSet):
    queryset = Ordinateur.objects.all()
    serializer_class =OrdinateurSerializer

class ImprimentViewSet(viewsets.ModelViewSet):
    queryset = Impriment.objects.all()
    serializer_class = ImprimentSerializer

class TelephoneViewSet(viewsets.ModelViewSet):
    queryset = Telephone.objects.all()
    serializer_class=TelephoneSerializers

class EcrantViewSet(viewsets.ModelViewSet):
    queryset = Ecrant.objects.all()
    serializer_class = EcrantSerializers

class ServeurViewSet(viewsets.ModelViewSet):
    queryset = Serveur.objects.all()
    serializer_class = ServeurSerializer

class LogicielViewSet(viewsets.ModelViewSet):
    queryset = Logiciel.objects.all()
    serializer_class = LogicielSerializer

class StockageExterneViewSet(viewsets.ModelViewSet):    
    queryset = StockageExterne.objects.all()
    serializer_class = StockageExterneSerializer

class RouteurViewSet(viewsets.ModelViewSet):
    queryset = Routeur.objects.all()
    serializer_class = RouteurSerializer

class PeripheriqueViewSet(viewsets.ModelViewSet):
    queryset = Peripherique.objects.all()
    serializer_class = PeripheriqueSerializer


# Largeur utile de la page A4 (en points) après déduction des marges par défaut (1 pouce de chaque côté)
# A4 = (595.27, 841.89) points
# Marges par défaut de SimpleDocTemplate sont de 1 pouce (72 points) de chaque côté
PAGE_WIDTH = A4[0]
LEFT_MARGIN = 72
RIGHT_MARGIN = 72
USABLE_WIDTH = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN # 595.27 - 72 - 72 = 451.27

# Fonction pour exporter les ordinateurs
def export_ordinateurs_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="ordinateurs.pdf"'

    doc = SimpleDocTemplate(response, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    elements.append(Paragraph("Liste des Ordinateurs", styles['Heading1']))
    elements.append(Spacer(1, 12))

    headers = ["Nom", "Marque", "Date Achat", "État", "OS", "ROM", "RAM", "Affecté à"]
    # Calcul dynamique de la largeur des colonnes
    col_width = USABLE_WIDTH / len(headers)
    colWidths = [col_width] * len(headers)

    data = [headers] # Ajout des en-têtes directement à la liste de données
    for o in Ordinateur.objects.select_related("assigned_to"):
        data.append([
            Paragraph(o.name or "", styles['Normal']),
            Paragraph(o.marque or "", styles['Normal']),
            Paragraph(o.date_achat.strftime("%d/%m/%Y") if o.date_achat else "", styles['Normal']),
            Paragraph(o.etat or "", styles['Normal']),
            Paragraph(o.system_exp or "", styles['Normal']),
            Paragraph(str(o.rom) or "", styles['Normal']), # Convertir en chaîne au cas où
            Paragraph(str(o.ram) or "", styles['Normal']), # Convertir en chaîne au cas où
            Paragraph(o.assigned_to.username if o.assigned_to else "-", styles['Normal'])
        ])

    # Utilisation de LongTable pour la gestion automatique de la hauteur des lignes
    table = LongTable(data, colWidths=colWidths)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.25, colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'), # Aligner le texte en haut de la cellule
    ]))
    elements.append(table)
    doc.build(elements)
    return response

# Fonction pour exporter les imprimantes
def export_imprimantes_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="imprimantes.pdf"'

    doc = SimpleDocTemplate(response, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    elements.append(Paragraph("Liste des Imprimantes", styles['Heading1']))
    elements.append(Spacer(1, 12))

    headers = ["Nom", "Marque", "Date Achat", "État", "Type", "Affecté à"]
    col_width = USABLE_WIDTH / len(headers)
    colWidths = [col_width] * len(headers)

    data = [headers]
    for i in Impriment.objects.select_related("assigned_to"):
        data.append([
            Paragraph(i.name or "", styles['Normal']),
            Paragraph(i.marque or "", styles['Normal']),
            Paragraph(i.date_achat.strftime("%d/%m/%Y") if i.date_achat else "", styles['Normal']),
            Paragraph(i.etat or "", styles['Normal']),
            Paragraph(i.type or "", styles['Normal']),
            Paragraph(i.assigned_to.username if i.assigned_to else "-", styles['Normal'])
        ])

    table = LongTable(data, colWidths=colWidths)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.25, colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    elements.append(table)
    doc.build(elements)
    return response

# Fonction pour exporter les écrans
def export_ecrants_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="ecrants.pdf"'

    doc = SimpleDocTemplate(response, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    elements.append(Paragraph("Liste des Écrans", styles['Heading1']))
    elements.append(Spacer(1, 12))

    headers = ["Nom", "Marque", "Date Achat", "État", "Taille", "Affecté à"]
    col_width = USABLE_WIDTH / len(headers)
    colWidths = [col_width] * len(headers)

    data = [headers]
    for e in Ecrant.objects.select_related("assigned_to"):
        data.append([
            Paragraph(e.name or "", styles['Normal']),
            Paragraph(e.marque or "", styles['Normal']),
            Paragraph(e.date_achat.strftime("%d/%m/%Y") if e.date_achat else "", styles['Normal']),
            Paragraph(e.etat or "", styles['Normal']),
            Paragraph(str(e.taille) or "", styles['Normal']), # Convertir en chaîne au cas où
            Paragraph(e.assigned_to.username if e.assigned_to else "-", styles['Normal'])
        ])

    table = LongTable(data, colWidths=colWidths)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.25, colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    elements.append(table)
    doc.build(elements)
    return response

# Fonction pour exporter les téléphones
def export_telephones_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="telephones.pdf"'

    doc = SimpleDocTemplate(response, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    elements.append(Paragraph("Liste des Téléphones", styles['Heading1']))
    elements.append(Spacer(1, 12))

    headers = ["Nom", "Marque", "Date Achat", "État", "Numéro", "Type", "Affecté à"]
    col_width = USABLE_WIDTH / len(headers)
    colWidths = [col_width] * len(headers)

    data = [headers]
    for t in Telephone.objects.select_related("assigned_to"):
        data.append([
            Paragraph(t.name or "", styles['Normal']),
            Paragraph(t.marque or "", styles['Normal']),
            Paragraph(t.date_achat.strftime("%d/%m/%Y") if t.date_achat else "", styles['Normal']),
            Paragraph(t.etat or "", styles['Normal']),
            Paragraph(t.numero or "", styles['Normal']),
            Paragraph(t.type or "", styles['Normal']),
            Paragraph(t.assigned_to.username if t.assigned_to else "-", styles['Normal'])
        ])

    table = LongTable(data, colWidths=colWidths)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.25, colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    elements.append(table)
    doc.build(elements)
    return response

# Fonction pour exporter tous les matériels groupés par type
def export_tous_materiels_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="materiels_groupes.pdf"'

    doc = SimpleDocTemplate(response, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()

    def add_table(title, headers, rows_data): # Renommé 'rows' en 'rows_data' pour éviter la confusion avec la variable locale 'rows'
        elements.append(Paragraph(title, styles['Heading2']))
        elements.append(Spacer(1, 6))
        
        # Calcul dynamique de la largeur des colonnes pour cette table spécifique
        col_count = len(headers)
        col_width = USABLE_WIDTH / col_count
        colWidths = [col_width] * col_count

        data = [headers] + rows_data # Ajout des en-têtes et des données
        
        # Utilisation de LongTable ici aussi
        table = LongTable(data, colWidths=colWidths)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('GRID', (0, 0), (-1, -1), 0.25, colors.black),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        elements.append(table)
        elements.append(Spacer(1, 12))

    # Préparation des données pour chaque type de matériel, en enveloppant chaque cellule dans un Paragraph
    ordinateurs = [
        [
            Paragraph(o.name or "", styles['Normal']),
            Paragraph(o.marque or "", styles['Normal']),
            Paragraph(o.date_achat.strftime("%d/%m/%Y") if o.date_achat else "", styles['Normal']),
            Paragraph(o.etat or "", styles['Normal']),
            Paragraph(o.system_exp or "", styles['Normal']),
            Paragraph(str(o.rom) or "", styles['Normal']),
            Paragraph(str(o.ram) or "", styles['Normal']),
            Paragraph(o.assigned_to.username if o.assigned_to else "-", styles['Normal'])
        ]
        for o in Ordinateur.objects.select_related("assigned_to")
    ]
    add_table("Ordinateurs", ["Nom", "Marque", "Date Achat", "État", "OS", "ROM", "RAM", "Affecté à"], ordinateurs)

    ecrants = [
        [
            Paragraph(e.name or "", styles['Normal']),
            Paragraph(e.marque or "", styles['Normal']),
            Paragraph(e.date_achat.strftime("%d/%m/%Y") if e.date_achat else "", styles['Normal']),
            Paragraph(e.etat or "", styles['Normal']),
            Paragraph(str(e.taille) or "", styles['Normal']),
            Paragraph(e.assigned_to.username if e.assigned_to else "-", styles['Normal'])
        ]
        for e in Ecrant.objects.select_related("assigned_to")
    ]
    add_table("Écrans", ["Nom", "Marque", "Date Achat", "État", "Taille", "Affecté à"], ecrants)

    imprimantes = [
        [
            Paragraph(i.name or "", styles['Normal']),
            Paragraph(i.marque or "", styles['Normal']),
            Paragraph(i.date_achat.strftime("%d/%m/%Y") if i.date_achat else "", styles['Normal']),
            Paragraph(i.etat or "", styles['Normal']),
            Paragraph(i.type or "", styles['Normal']),
            Paragraph(i.assigned_to.username if i.assigned_to else "-", styles['Normal'])
        ]
        for i in Impriment.objects.select_related("assigned_to")
    ]
    add_table("Imprimantes", ["Nom", "Marque", "Date Achat", "État", "Type", "Affecté à"], imprimantes)

    telephones = [
        [
            Paragraph(t.name or "", styles['Normal']),
            Paragraph(t.marque or "", styles['Normal']),
            Paragraph(t.date_achat.strftime("%d/%m/%Y") if t.date_achat else "", styles['Normal']),
            Paragraph(t.etat or "", styles['Normal']),
            Paragraph(t.numero or "", styles['Normal']),
            Paragraph(t.type or "", styles['Normal']),
            Paragraph(t.assigned_to.username if t.assigned_to else "-", styles['Normal'])
        ]
        for t in Telephone.objects.select_related("assigned_to")
    ]
    add_table("Téléphones", ["Nom", "Marque", "Date Achat", "État", "Numéro", "Type", "Affecté à"], telephones)

    doc.build(elements)
    return response
