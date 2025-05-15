from .serializers import TicketSerializers,TicketCommentSerializer
from .models import Ticket,TicketComment
from Notifications.models import Notification
from App_Users.models import App_User
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializers

    def perform_create(self, serializer):
        ticket = serializer.save(created_by=self.request.user)

        # Trouver l’admin (ou tous les admins si plusieurs)
        admin_users = User.objects.filter(role='admin')
        
        for admin in admin_users:
            Notification.objects.create(
                user=admin,
                message=f"Un nouveau ticket a été créé par {self.request.user.username} : {ticket.title}",
            )
        if ticket.assigned_to:
            Notification.objects.create(
                user=ticket.assigned_to,
                 message=f"Un ticket vous a été assigné : {ticket.title}",
                 )
            
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Sauvegarde de l'ancien technicien avant la mise à jour
        old_assigned_to = instance.assigned_to

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        ticket = serializer.save()

        # ✅ Si le ticket est maintenant fermé → notifier l'admin + l'utilisateur qui a créé le ticket
        if ticket.status == 'fermé' and instance.status != 'fermé':
            admin_users = User.objects.filter(role='admin')
            for admin in admin_users:
                Notification.objects.create(
                    user=admin,
                    message=f"Le ticket #{ticket.id} - '{ticket.title}' a été fermé."
                )

            Notification.objects.create(
                user=ticket.created_by,
                message=f"Votre ticket #{ticket.id} - '{ticket.title}' a été fermé."
            )

        # ✅ Si le technicien assigné a changé → notifier le nouveau
        if ticket.assigned_to and ticket.assigned_to != old_assigned_to:
            Notification.objects.create(
                user=ticket.assigned_to,
                message=f"Un ticket vous a été assigné : {ticket.title}"
            )

        return Response(serializer.data)


class TicketCommentViewSet(viewsets.ModelViewSet):
    serializer_class = TicketCommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Filtrer les commentaires par ticket si un paramètre de ticket est fourni
        ticket_id = self.request.query_params.get('ticket', None)
        if ticket_id:
            try:
                ticket = Ticket.objects.get(id=ticket_id)
                return TicketComment.objects.filter(ticket=ticket)
            except Ticket.DoesNotExist:
                return TicketComment.objects.none()
        return TicketComment.objects.none()
    
    def create(self, request, *args, **kwargs):
        # Ajouter le ticket à partir des paramètres de requête ou du corps de la requête
        ticket_id = request.data.get('ticket')
        
        try:
            ticket = Ticket.objects.get(id=ticket_id)
        except Ticket.DoesNotExist:
            return Response(
                {"detail": "Ticket non trouvé."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Vérifier si le ticket est fermé
        if ticket.status == 'fermé':
            return Response(
                {"detail": "Impossible d'ajouter un commentaire à un ticket fermé."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Vérifier si l'utilisateur peut commenter
        if not ticket.can_add_comment(request.user):
            return Response(
                {"detail": "Vous n'êtes pas autorisé à commenter ce ticket."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Créer le serializer avec le contexte de la requête
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, 
            status=status.HTTP_201_CREATED, 
            headers=headers
        )