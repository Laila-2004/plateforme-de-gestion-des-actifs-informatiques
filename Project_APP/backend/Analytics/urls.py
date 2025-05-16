from django.urls import path
from .views import PredictPanneAPIView,MaintenancePredictionListAPIView

urlpatterns = [
    path('predict_panne/<int:asset_id>/', PredictPanneAPIView.as_view()),
    path('predictions/', MaintenancePredictionListAPIView.as_view()),

]
