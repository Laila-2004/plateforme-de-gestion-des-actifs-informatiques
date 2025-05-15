from rest_framework import serializers
from App_Users.serializers import App_UserSerializer
from Materiels.models import Materiel
from App_Users.models import App_User
from .models import TicketComment, Ticket

class TicketSerializers(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=App_User.objects.all(), allow_null=True )
    assigned_to_details = App_UserSerializer(source='assigned_to', read_only=True)

    asset = serializers.PrimaryKeyRelatedField(queryset=Materiel.objects.all(),allow_null=True )
    asset_details = serializers.SerializerMethodField()

    created_by = serializers.PrimaryKeyRelatedField(queryset=App_User.objects.all())
    created_by_details = App_UserSerializer(source='created_by', read_only=True)

    def get_asset_details(self, obj):
        from Materiels.serializers import OrdinateurSerializer, EcrantSerializers, ImprimentSerializer, TelephoneSerializers, MaterielSerializer
        asset = obj.asset
        if asset is None:
            return None
        if hasattr(asset, 'ordinateur'):
            return OrdinateurSerializer(asset.ordinateur).data
        elif hasattr(asset, 'ecrant'):
            return EcrantSerializers(asset.ecrant).data
        elif hasattr(asset, 'impriment'):
            return ImprimentSerializer(asset.impriment).data
        elif hasattr(asset, 'telephone'):
            return TelephoneSerializers(asset.telephone).data
        return MaterielSerializer(asset).data

    class Meta:
        model = Ticket
        fields = [
    'id', 'assigned_to', 'assigned_to_details',
    'asset', 'asset_details',
    'title', 'opening_date', 'close_date',
    'status', 'priority', 'category', 'type_ticket',
    'description', 'created_by','created_by_details'
]
        


class TicketCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_username = serializers.SerializerMethodField()
    
    class Meta:
        model = TicketComment
        fields = [
            'id', 
            'ticket', 
            'author', 
            'author_name', 
            'author_username',
            'content', 
            'created_at'
        ]
        read_only_fields = ['id', 'author', 'created_at']
    
    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}"
    
    def get_author_username(self, obj):
        return obj.author.username
    
    def create(self, validated_data):
        # Récupérer le ticket
        ticket = validated_data.get('ticket')
        
        # Récupérer l'utilisateur actuel à partir du contexte
        author = self.context.get('request').user
        
        # Vérifier si l'utilisateur peut ajouter un commentaire
        if not ticket.can_add_comment(author):
            raise serializers.ValidationError("Vous n'êtes pas autorisé à commenter ce ticket.")
        
        # Définir l'auteur
        validated_data['author'] = author
        
        # Créer le commentaire
        return super().create(validated_data)