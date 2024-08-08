from django.urls import path
from .views import get_estudiante

urlpatterns = [
    path('user/', get_estudiante, name='user'),
]