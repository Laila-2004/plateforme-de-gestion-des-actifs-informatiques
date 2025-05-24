from rest_framework import serializers
from .models import Ordinateur , Impriment,Telephone,Ecrant,Materiel
from App_Users.models import App_User
from App_Users.serializers import App_UserSerializer

class MaterielSerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=App_User.objects.all(),allow_null=True )
    assigned_to_details = App_UserSerializer(source='assigned_to', read_only=True)
    class Meta : 
        model = Materiel
        fields = '__all__'

class OrdinateurSerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=App_User.objects.all(),allow_null=True )
    assigned_to_details = App_UserSerializer(source='assigned_to', read_only=True)
    class Meta : 
        model = Ordinateur
        fields = '__all__'

class ImprimentSerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=App_User.objects.all(),allow_null=True )
    assigned_to_details = App_UserSerializer(source='assigned_to', read_only=True)
    class Meta :
        model = Impriment
        fields = '__all__'

class TelephoneSerializers(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=App_User.objects.all(),allow_null=True )
    assigned_to_details = App_UserSerializer(source='assigned_to', read_only=True)
    class Meta:
        model = Telephone
        fields='__all__'
class EcrantSerializers(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=App_User.objects.all(),allow_null=True )
    assigned_to_details = App_UserSerializer(source='assigned_to', read_only=True)
    class Meta :
        model= Ecrant
        fields ='__all__'