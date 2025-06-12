from rest_framework import viewsets
from .models import App_User,Department,Service
from .serializers import App_UserSerializer,DepartmentSerializer,ServiceSerializer

from reportlab.lib.pagesizes import A4
from django.http import HttpResponse
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, LongTable

# Create your views here.
class App_UserViewSet(viewsets.ModelViewSet):
    queryset = App_User.objects.all()
    serializer_class =App_UserSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset =Department.objects.all()
    serializer_class=DepartmentSerializer
    
class ServiceViewSet(viewsets.ModelViewSet):
    queryset=Service.objects.all()
    serializer_class=ServiceSerializer

def export_users_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="liste_utilisateurs.pdf"'

    doc = SimpleDocTemplate(response, pagesize=A4)
    elements = []

    styles = getSampleStyleSheet()
    title = Paragraph("Liste des Utilisateurs", styles['Heading1'])
    elements.append(title)
    elements.append(Spacer(1, 12))

    # En-têtes du tableau
    data = [[
        "Nom",
        "Prénom",
        "Email",
        "Téléphone",
        "Rôle",
        "Service",
        "Département"
    ]]

    # Données du tableau
    for user in App_User.objects.all():
        service_name = user.service.name if user.service else "-"
        department_name = user.service.department.name if user.service and user.service.department else "-"
        data.append([
            user.last_name,
            user.first_name,
            user.email,
            user.phone,
            dict(App_User._meta.get_field('role').choices).get(user.role, user.role),
            service_name,
            department_name,
        ])

    # Style et mise en forme du tableau
    table = Table(data, colWidths=[60, 60, 110, 60, 60, 80, 80]) 
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
        ('GRID', (0, 0), (-1, -1), 0.25, colors.black),
    ]))

    elements.append(table)
    doc.build(elements)
    return response

def export_departements_services_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="departements_services.pdf"'

    doc = SimpleDocTemplate(response, pagesize=A4)
    elements = []

    styles = getSampleStyleSheet()
    title = Paragraph("Liste des Départements et Services", styles['Heading1'])
    elements.append(title)
    elements.append(Spacer(1, 12))

    # Récupération des départements avec leurs services
    for dept in Department.objects.prefetch_related('services').all():
        dept_title = Paragraph(f"<b>Département :</b> {dept.name}", styles['Heading2'])
        elements.append(dept_title)
        elements.append(Spacer(1, 6))

        services = dept.services.all()
        if services:
            data = [["Nom du service", "Description"]]
            for service in services:
                # Ensure description is a string, even if empty
                description_text = service.description or ""
                data.append([service.name, Paragraph(description_text, styles['Normal'])]) # Wrap description in Paragraph
            
            # Use LongTable instead of Table
            # Adjust colWidths if needed. The 300 for description is a good start.
            table = LongTable(data, colWidths=[200, 300]) 
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('GRID', (0, 0), (-1, -1), 0.25, colors.grey),
                ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
                ('VALIGN', (0,0), (-1,-1), 'TOP'), # Align text to the top of the cell
            ]))
            elements.append(table)
            elements.append(Spacer(1, 12))
        else:
            elements.append(Paragraph("Aucun service enregistré pour ce département.", styles['Normal']))
            elements.append(Spacer(1, 12))

    doc.build(elements)
    return response