from rest_framework import viewsets
from .models import Ordinateur,Telephone,Ecrant,Impriment
from .serializers import OrdinateurSerializer,ImprimentSerializer,TelephoneSerializers,EcrantSerializers
# Create your views here.
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
