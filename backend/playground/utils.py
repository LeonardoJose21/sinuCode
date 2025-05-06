import re
from django.db.models import Count
from .models import ProblemasResueltos

def contains_error(output, language):
    output_lower = output.lower()

    if language == 'python':
        return 'traceback' in output_lower
    elif language == 'cpp':
        return bool(re.search(r'(error:|undefined reference|segmentation fault)', output_lower))
    elif language == 'java':
        return bool(re.search(r'(exception|error:|at\s+java\.)', output_lower))
    return True  # Default to error if language is unknown

def actualizar_estadisticas_estudiante(estudiante):
    # Obtener la cantidad total de problemas resueltos
    cantidad = ProblemasResueltos.objects.filter(estudiante=estudiante).count()

    # Obtener la dificultad más frecuente de los problemas resueltos
    dificultad = (
        ProblemasResueltos.objects
        .filter(estudiante=estudiante)
        .values('problema__dificultad')
        .annotate(conteo=Count('problema__dificultad'))
        .order_by('-conteo')
        .first()
    )

    estudiante.cantidad_ejercicios_resueltos = cantidad
    estudiante.dificultad_predominante = dificultad['problema__dificultad'] if dificultad else None
    estudiante.save()
