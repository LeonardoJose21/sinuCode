# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .models import Estudiante
from .serializers import EstudianteSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated

class RegisterView(generics.CreateAPIView):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer
    permission_classes = [AllowAny]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_estudiante(request):
    try:
        estudiante = Estudiante.objects.get(user=request.user)
    except Estudiante.DoesNotExist:
        return Response({'error': 'Estudiante not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = EstudianteSerializer(estudiante)
    return Response(serializer.data, status=status.HTTP_200_OK)



