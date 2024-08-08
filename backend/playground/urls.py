# urls.py
from django.urls import path
from .views import chatgpt_api, verify_solution, get_problems

urlpatterns = [
    path('api/chatgpt/', chatgpt_api, name='chatgpt_api'),
    path('api/verify-solution/', verify_solution, name='verify_solution'),
    path('get_problems/', get_problems, name='get_problems'),
]
