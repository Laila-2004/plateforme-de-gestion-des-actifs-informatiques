from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import MaintenancePredictionViewSet

router = DefaultRouter()
router.register(r'predictions', MaintenancePredictionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]