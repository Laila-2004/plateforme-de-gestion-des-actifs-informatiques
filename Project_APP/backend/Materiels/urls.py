from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrdinateurViewSet,ImprimentViewSet,TelephoneViewSet,EcrantViewSet

router = DefaultRouter()
router.register(r'ordinateurs',OrdinateurViewSet)
router.register(r'impriments',ImprimentViewSet)
router.register(r'telephones',TelephoneViewSet)
router.register(r'ecrants',EcrantViewSet)

urlpatterns = [
    path('',include(router.urls)),
]