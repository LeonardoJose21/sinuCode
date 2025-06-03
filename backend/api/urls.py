from django.urls import path
from .views import RegisterDocenteView, RegisterMonitorView, get_docente, \
      get_estudiante, get_monitor, request_password_reset, reset_password

urlpatterns = [
    path('user/register-monitor/', RegisterMonitorView.as_view(), name='register-monitor'),
    path('user/register-docente/', RegisterDocenteView.as_view(), name='register-docente'),
    path('user/monitor/', get_monitor, name='get-monitor'),
    path('user/docente/', get_docente, name='get-docente'),
    path('user/', get_estudiante, name='user'),
    path('request-password-reset/', request_password_reset, name='request-password-reset'),
    path('reset-password/', reset_password, name='reset-password'),
]