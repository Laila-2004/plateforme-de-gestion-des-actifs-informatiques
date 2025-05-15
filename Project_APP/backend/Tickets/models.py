from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from Notifications.models import Notification
# Create your models here.

User = get_user_model()

class Ticket(models.Model):
    title = models.CharField(max_length=200)
    opening_date = models.DateTimeField(auto_now_add=True)
    close_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=[
        ('ouvert', 'Ouvert'),
        ('en_cours', 'En cours'),
        ('fermé', 'Fermé')
    ])
    priority = models.CharField(max_length=20, choices=[
        ('faible', 'Faible'),
        ('moyenne', 'Moyenne'),
        ('haute', 'Haute'),
        ('critique', 'Critique')
    ], default='moyenne')
    category = models.CharField(max_length=100,choices=[
         ('reseau', 'Problème Réseau'),
         ('materiel', 'Problème Matériel'),
         ('logiciel', 'Problème Logiciel'),
         ('securite', 'Problème de Sécurité'),
         ('compte', 'Problème de Compte'),
         ('autre', 'Autre'),
    ])
    type_ticket=models.CharField(max_length=50  ,choices=[
         ('incident', 'Incident'),
         ('demande', 'Demande'),
         ('maintenance', 'Maintenance Préventive'),
    ], null=True)
    created_by = models.ForeignKey('App_Users.App_User', on_delete=models.CASCADE, related_name='created_tickets')
    assigned_to = models.ForeignKey('App_Users.App_User', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    asset = models.ForeignKey('Materiels.Materiel', on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField()

    def __str__(self):
        return self.title
    

    def can_add_comment(self, user):
        """
        Vérifie si un utilisateur peut ajouter un commentaire sur le ticket
        """
        # Le ticket ne doit pas être fermé
        if self.status == 'fermé':
            return False
        
        # L'utilisateur doit être soit le créateur, l'admin, ou la personne assignée
        return (
            user == self.created_by or 
            user == self.assigned_to or 
            getattr(user, 'role', '') == 'admin'  # Vérifie si l'utilisateur est un admin
        )


    
class TicketComment(models.Model):
    ticket = models.ForeignKey(Ticket,  on_delete=models.CASCADE, related_name='comments')
    
    author = models.ForeignKey('App_Users.App_User', on_delete=models.CASCADE)
    
    content = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def clean(self):
        """
        Validation personnalisée pour s'assurer que le commentaire 
        peut être ajouté uniquement si le ticket n'est pas fermé
        """
        if self.ticket.status == 'fermé':
            raise ValidationError("Impossible d'ajouter un commentaire à un ticket fermé.")
    
    def save(self, *args, **kwargs):
        """
        Surcharge de la méthode save pour vérifier les permissions
        avant d'enregistrer le commentaire
        """
        # Vérifie si l'auteur a le droit d'ajouter un commentaire
        if not self.ticket.can_add_comment(self.author):
            raise ValidationError("Vous n'êtes pas autorisé à commenter ce ticket.")
        
        # Appel de la méthode save parente
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Commentaire de {self.author} sur le ticket {self.ticket}"

    class Meta:
        ordering = ['-created_at']  # Trier les commentaires du plus récent au plus ancien