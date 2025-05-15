from rest_framework import viewsets
from .models import App_User,Department,Service
from .serializers import App_UserSerializer,DepartmentSerializer,ServiceSerializer
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