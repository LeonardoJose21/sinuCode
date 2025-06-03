# views.py
from django.conf import settings
from django.utils import timezone
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count, Avg
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json
from api.models import Estudiante, Monitor
from api.serializers import ProblemasResueltosSerializer
from .utils import MonitoriasSerializer, actualizar_estadisticas_estudiante, contains_error
from .models import EncuestasPreguntas, EncuestasRespuestas, Monitorias, ProblemasDeProgramacion, ProblemasResueltos, Retroalimentacion

@csrf_exempt
def chatgpt_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_input = data.get('input', '')

        # Make a request to the ChatGPT API
        headers = {
            'Authorization': f'Bearer {settings.OPENAI_API_KEY}',
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
                'clientId': settings.JDOODLE_CLIENT_ID,
                'clientSecret': settings.JDOODLE_CLIENT_SECRET
            }
        )
        result = response.json()
        output = result.get('output', '')

        # Determine success or error
        status = 'error' if contains_error(output, language) else 'success'

        return JsonResponse({'output': output, 'status': status})
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def get_problems(request):
    problems = ProblemasDeProgramacion.objects.all().values('id','problema', 'dificultad', 'tema', 'lenguaje')
    return JsonResponse(list(problems), safe=False)

def get_all_monitors(request):
    monitors = Monitor.objects.all().values('id', 'nombre_completo', 'rol')
    return JsonResponse(list(monitors), safe=False)

def get_questions(request):
    preguntas = EncuestasPreguntas.objects.all().values('id', 'pregunta','tipo','opciones')
    return JsonResponse(list(preguntas), safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_answers_survey(request):
    try:
        data = json.loads(request.body)
        estudiante = Estudiante.objects.get(user=request.user)

        for pregunta_id_str, respuesta in data.items():
            pregunta_id = int(pregunta_id_str)
            pregunta = EncuestasPreguntas.objects.get(id=pregunta_id)
            try:
                EncuestasRespuestas.objects.create(
                    pregunta=pregunta,
                    estudiante=estudiante,
                    respuesta=str(respuesta),
                    fecha=timezone.now()
                )
            except Exception as e:
                print(f"Error al guardar respuesta: {e}")

        return JsonResponse({"message": "Respuestas guardadas correctamente."}, status=201)

    except Estudiante.DoesNotExist:
        return JsonResponse({"error": "Estudiante no encontrado."}, status=400)

    except EncuestasPreguntas.DoesNotExist:
        return JsonResponse({"error": "Pregunta no encontrada."}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ask_for_monitory(request):
    try:
        data = json.loads(request.body)
        tema = data.get("tema")
        modalidad = data.get("modalidad")
        monitor_id = int(data.get("monitor_id"))
        fecha = data.get("fecha")
        hora = data.get("hora")
        fecha_hora_str = f"{fecha} {hora}"
        # Convertir la cadena de fecha y hora a un objeto datetime
        fecha_hora = timezone.datetime.strptime(fecha_hora_str, "%Y-%m-%d %H:%M")
       

        estudiante = Estudiante.objects.get(user=request.user)
        monitor = Monitor.objects.get(id=monitor_id)
        try:

            Monitorias.objects.create(
                tema=tema,
                modalidad=modalidad,
                estudiante=estudiante,
                monitor=monitor,
                fecha=fecha_hora
            )
        except Exception as e:
            print(f"Error al crear monitoria: {e}")
            return JsonResponse({"error": "Error al crear la monitoria."}, status=500)

        return JsonResponse({"message": "Solicitud enviada exitosamente."}, status=201)

    except Estudiante.DoesNotExist:
        return JsonResponse({"error": "Estudiante no encontrado."}, status=404)
    except Monitor.DoesNotExist:
        return JsonResponse({"error": "Monitor no encontrado."}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

def get_all_users(request):
    dificultad_weights = {
        'facil': 1,
        'medio': 2,
        'dificil': 3
    }

    estudiantes = Estudiante.objects.all()
    print(estudiantes)
    data = []

    for estudiante in estudiantes:
        dificultad = estudiante.dificultad_predominante.lower()
        weight = dificultad_weights.get(dificultad, 0)
        total_puntos = estudiante.cantidad_ejercicios_resueltos * weight

        data.append({
            'id': estudiante.id,
            'nombre_completo': estudiante.nombre_completo,
            'puntos': total_puntos,
        })

    # Ordenar por puntos descendente
    sorted_data = sorted(data, key=lambda x: x['puntos'], reverse=True)

    return JsonResponse(sorted_data, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_feedback(request):
    try:
        data = json.loads(request.body)
        comentario = data.get("comentario", "").strip()

        if not comentario:
            return JsonResponse({"error": "Comentario vacío"}, status=400)

        estudiante = Estudiante.objects.get(user=request.user)
        Retroalimentacion.objects.create(
            estudiante=estudiante,
            comentario=comentario,
            fecha=timezone.now()
        )

        return JsonResponse({"message": "Comentario guardado con éxito"}, status=201)
    except Estudiante.DoesNotExist:
        return JsonResponse({"error": "Estudiante no encontrado"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def get_all_feedback(request):
    feedbacks = Retroalimentacion.objects.select_related('estudiante').all()
    
    feedbacks_data = [
        {
            'id': feedback.id,
            'comentario': feedback.comentario,
            'fecha': feedback.fecha,
            'estudiante_nombre': feedback.estudiante.nombre_completo  # or feedback.estudiante.nombre
        }
        for feedback in feedbacks
    ]
    
    return JsonResponse(feedbacks_data, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_verified_problem(request):
    try:
        data = json.loads(request.body)
        estudiante = Estudiante.objects.get(user=request.user)

        problema_id = data.get('problema_id')
        solucion = data.get('solucion')
        retroalimentacion = data.get('retroalimentacion')

        if not problema_id or not solucion or not retroalimentacion:
            return JsonResponse({"error": "Faltan campos requeridos."}, status=400)

        try:
            problema = ProblemasDeProgramacion.objects.get(id=problema_id)
        except ProblemasDeProgramacion.DoesNotExist:
            return JsonResponse({"error": "Problema no encontrado."}, status=404)

        ProblemasResueltos.objects.create(
            estudiante=estudiante,
            problema=problema,
            solucion=solucion,
            retroalimentacion=retroalimentacion
        )
        actualizar_estadisticas_estudiante(estudiante)

        return JsonResponse({"message": "Problema guardado exitosamente."}, status=201)

    except Estudiante.DoesNotExist:
        return JsonResponse({"error": "Estudiante no encontrado."}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_written_problem(request):
    try:
        data = json.loads(request.body)
        # estudiante = Estudiante.objects.get(user=request.user)

        problema = data.get('problema')
        lenguaje = data.get('lenguaje')
        dificultad = data.get('dificultad')
        tema = data.get('tema')

        nuevo_problema = ProblemasDeProgramacion.objects.create(
            problema=problema,
            lenguaje=lenguaje,
            dificultad=dificultad,
            tema=tema if tema else ""
        )

        return JsonResponse({'id': nuevo_problema.id}, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def solved_problems_view(request):
    try:
        estudiante = Estudiante.objects.get(user=request.user)
        resueltos = ProblemasResueltos.objects.filter(estudiante=estudiante)
        serializer = ProblemasResueltosSerializer(resueltos, many=True)
        return JsonResponse(serializer.data, safe=False)
    except Estudiante.DoesNotExist:
        return JsonResponse({'error': 'Estudiante no encontrado'}, status=404)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_metrics(request):
    # Problemas metrics
    problemas_por_dificultad = ProblemasDeProgramacion.objects.values('dificultad').annotate(total=Count('id'))
    problemas_por_lenguaje = ProblemasDeProgramacion.objects.values('lenguaje').annotate(total=Count('id'))
    problemas_por_tema = ProblemasDeProgramacion.objects.values('tema').annotate(total=Count('id')).order_by('-total')[:10]

    # Problemas resueltos
    total_resueltos = ProblemasResueltos.objects.count()
    resueltos_por_dificultad = ProblemasResueltos.objects.values('problema__dificultad').annotate(total=Count('id'))
    resueltos_por_estudiante = ProblemasResueltos.objects.values('estudiante__nombre_completo').annotate(total=Count('id')).order_by('-total')[:10]

    # Monitorías
    monitorias_por_modalidad = Monitorias.objects.values('modalidad').annotate(total=Count('id'))
    monitorias_por_tema = Monitorias.objects.values('tema').annotate(total=Count('id')).order_by('-total')[:10]

    # Retroalimentación
    total_feedback = Retroalimentacion.objects.count()
    feedback_por_dia = Retroalimentacion.objects.extra(select={'day': "DATE(fecha)"}).values('day').annotate(total=Count('id')).order_by('day')

    # Encuestas
    respuestas_por_pregunta = EncuestasRespuestas.objects.values('pregunta__pregunta').annotate(total=Count('id')).order_by('-total')

    # Estudiantes
    total_estudiantes = Estudiante.objects.count()
    promedio_resueltos = Estudiante.objects.aggregate(avg=Avg('cantidad_ejercicios_resueltos'))['avg']
    dificultad_predominante = Estudiante.objects.values('dificultad_predominante').annotate(total=Count('id')).order_by('-total')

    return Response({
        "problemas_por_dificultad": list(problemas_por_dificultad),
        "problemas_por_lenguaje": list(problemas_por_lenguaje),
        "problemas_por_tema": list(problemas_por_tema),

        "resueltos_totales": total_resueltos,
        "resueltos_por_dificultad": list(resueltos_por_dificultad),
        "resueltos_por_estudiante": list(resueltos_por_estudiante),

        "monitorias_por_modalidad": list(monitorias_por_modalidad),
        "monitorias_por_tema": list(monitorias_por_tema),

        "retroalimentaciones_totales": total_feedback,
        "feedback_por_dia": list(feedback_por_dia),

        "respuestas_por_pregunta": list(respuestas_por_pregunta),

        "total_estudiantes": total_estudiantes,
        "promedio_resueltos_por_estudiante": promedio_resueltos,
        "dificultad_predominante": list(dificultad_predominante),
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_monitorias(request):
    monitorias = Monitorias.objects.all()
    serializer = MonitoriasSerializer(monitorias, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_monitorias_by_monitor(request):
    try:
        monitor = Monitor.objects.get(user=request.user)
    except Monitor.DoesNotExist:
        return Response({"detail": "No existe monitor asociado al usuario."}, status=404)

    monitorias = Monitorias.objects.filter(monitor=monitor)
    serializer = MonitoriasSerializer(monitorias, many=True)
    return Response(serializer.data)