from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import App_UserViewSet,DepartmentViewSet,ServiceViewSet,export_users_pdf, export_departements_services_pdf

router = DefaultRouter()
router.register(r'app_users',App_UserViewSet)
router.register(r'departments',DepartmentViewSet)
router.register(r'services',ServiceViewSet)
urlpatterns = [
    path('',include(router.urls)),
    path('export/users/', export_users_pdf, name='export_users_pdf'),
    path('export-departements-services/', export_departements_services_pdf, name='export_departements_services'),

]
