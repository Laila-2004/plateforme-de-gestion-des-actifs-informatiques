from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import App_UserViewSet,DepartmentViewSet,ServiceViewSet

router = DefaultRouter()
router.register(r'app_users',App_UserViewSet)
router.register(r'departments',DepartmentViewSet)
router.register(r'services',ServiceViewSet)
urlpatterns = [
    path('',include(router.urls)),
]
