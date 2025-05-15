from rest_framework.routers import DefaultRouter
from django.urls import path,include
from .views import TicketViewSet,TicketCommentViewSet

router = DefaultRouter()
router.register(r'tickets',TicketViewSet)
router.register(r'ticket-comments', TicketCommentViewSet, basename='ticket-comment')
urlpatterns = [
    path('',include(router.urls))
]
