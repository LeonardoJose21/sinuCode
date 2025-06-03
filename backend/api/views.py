# views.py
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
import jwt
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework import status
from rest_framework import generics
from .models import Docente, Estudiante, Monitor
from .serializers import DocenteSerializer, EstudianteSerializer, MonitorSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

JWT_SECRET = settings.SECRET_KEY
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = 3600  # 1 hour token expiration

class RegisterView(generics.CreateAPIView):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer
    permission_classes = [AllowAny]

# Personal académico registration
class RegisterMonitorView(generics.CreateAPIView):
    queryset = Monitor.objects.all()
    serializer_class = MonitorSerializer
    permission_classes = [AllowAny]

class RegisterDocenteView(generics.CreateAPIView):
    queryset = Docente.objects.all()
    serializer_class = DocenteSerializer
    permission_classes = [AllowAny]

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def get_estudiante(request):
    try:
        estudiante = Estudiante.objects.get(user=request.user)
    except Estudiante.DoesNotExist:
        return Response({'error': 'Estudiante not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = EstudianteSerializer(estudiante)
    return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_monitor(request):
    try:
        monitor = Monitor.objects.get(user=request.user)
        serializer = MonitorSerializer(monitor)
        return Response(serializer.data)
    except Monitor.DoesNotExist:
        return Response({'error': 'Monitor not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_docente(request):
    try:
        docente = Docente.objects.get(user=request.user)
        serializer = DocenteSerializer(docente)
        return Response(serializer.data)
    except Docente.DoesNotExist:
        return Response({'error': 'Docente not found'}, status=status.HTTP_404_NOT_FOUND)
    
def generate_jwt_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

@csrf_exempt
def request_password_reset(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=400)
    
    data = json.loads(request.body)
    email = data.get('email')
    if not email:
        return JsonResponse({'error': 'Email is required'}, status=400)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Don't reveal user existence
        return JsonResponse({'message': 'El correo ingresado no está asociado a ningun usuario'})
    
    token = generate_jwt_token(user.id)
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    # Send reset email
    send_mail(
        subject='Instrucciones para el cambio de contraseña',
        message=f"Para cambiar su contraseña, deberá hacer ir al siguiente link: {reset_link}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
    )
    print("email", email)
    
    return JsonResponse({'message': 'Se han eviado instrucciones para cambiar su contraseña'})

@csrf_exempt
def reset_password(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=400)
    
    data = json.loads(request.body)
    token = data.get('token')
    new_password = data.get('new_password')

    if not token or not new_password:
        return JsonResponse({'error': 'Token and new password required'}, status=400)
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload['user_id']
        user = User.objects.get(id=user_id)
    except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
        return JsonResponse({'error': 'Invalid or expired token'}, status=400)
    
    user.set_password(new_password)
    user.save()
    
    # Optionally send onboarding or confirmation email here
    send_mail(
        subject='Se ha actualizado su contraseña',
        message='Su contraseña se actualizó exitodamente ;).',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )
    
    return JsonResponse({'message': 'Se actualizó la contraseña con éxito'})

