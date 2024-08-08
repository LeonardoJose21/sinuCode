# views.py
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import CodingProblem

@csrf_exempt
def chatgpt_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_input = data.get('input', '')

        # Make a request to the ChatGPT API
        api_key = 'sk-None-mUXDSszrSuqh2qzUc4NST3BlbkFJSfCYy4zdWIzFg1b594eV'
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        payload = {
            'model': 'gpt-3.5-turbo',
            'messages': [{'role': 'user', 'content': user_input}],
            'max_tokens': 150
        }

        response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=payload)
        result = response.json()

        return JsonResponse(result)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

@csrf_exempt
def verify_solution(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        script = data.get('script')
        language = data.get('language')
        
        if language.lower() == 'python':
            language_api = 'python3'
            version_index = '3'
        elif language.lower() == 'cpp':
            language_api = 'cpp17'
            version_index = '0'
        elif language.lower() == 'java':
            language_api = 'java'
            version_index = '3'
        else:
            return JsonResponse({'error': 'Unsupported language'}, status=400)

        response = requests.post(
            "https://api.jdoodle.com/v1/execute",
            json={
                'script': script,
                'language': language_api,
                'versionIndex': version_index,
                'clientId': 'b6e3ee5f138d6189c8b7ac9646ad2c5b',
                'clientSecret': '3ba5a1cc883527c231094d280af59081388ef174d6a853ec0a04fb128e0e3fed'
            }
        )
        return JsonResponse(response.json())
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def get_problems(request):
    problems = CodingProblem.objects.all().values('id_problema','problema', 'dificultad', 'tema', 'lenguaje')
    return JsonResponse(list(problems), safe=False)

