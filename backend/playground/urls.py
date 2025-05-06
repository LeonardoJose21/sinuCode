# urls.py
from django.urls import path
from .views import ask_for_monitory, chatgpt_api, get_all_feedback, get_all_monitors, \
    get_all_users, get_questions, save_verified_problem, save_written_problem, solved_problems_view, \
    submit_feedback, verify_solution, \
    get_problems, save_answers_survey

urlpatterns = [
    path('api/chatgpt/', chatgpt_api, name='chatgpt_api'),
    path('api/verify-solution/', verify_solution, name='verify_solution'),
    path('get_problems/', get_problems, name='get_problems'),
    path('api/encuesta/preguntas/', get_questions, name='get_questions'),
    path('api/encuesta/respuestas/', save_answers_survey, name='save_answers'),
    path('api/monitor/', get_all_monitors, name='get_all_monitors'),
    path('api/solicitar-monitoria/', ask_for_monitory, name='ask_for_monitoring'),
    path('api/get_all_users/', get_all_users, name='get_all_users'),
    path('api/feedback/', submit_feedback, name='submit_feedback'),
    path('api/all_feedback/', get_all_feedback, name='submit_feedback'),
    path('api/save-verified-problem/', save_verified_problem, name='save_problem'),
    path('api/save-written-problem/', save_written_problem, name='save_written_problem'),
    path('api/resueltos/', solved_problems_view, name='get_resolved_problems'),
]
