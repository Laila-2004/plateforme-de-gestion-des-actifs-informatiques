from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'materiels', MaterielViewSet)
router.register(r'ordinateurs',OrdinateurViewSet)
router.register(r'impriments',ImprimentViewSet)
router.register(r'telephones',TelephoneViewSet)
router.register(r'ecrants',EcrantViewSet)
router.register(r'serveurs',ServeurViewSet)
router.register(r'logiciels',LogicielViewSet)   
router.register(r'stockages-externes',StockageExterneViewSet)
router.register(r'peripheriques',PeripheriqueViewSet)
router.register(r'routeurs',RouteurViewSet)

urlpatterns = [
    path('',include(router.urls)),
    path('export-ordinateurs/', export_ordinateurs_pdf, name='export_ordinateurs'),
    path('export-ecrants/', export_ecrants_pdf, name='export_ecrants'),
    path('export-imprimantes/', export_imprimantes_pdf, name='export_imprimantes'),
    path('export-telephones/', export_telephones_pdf, name='export_telephones'),
    path('export-materiels-groupes/', export_tous_materiels_pdf, name='export_tous_materiels'),
]