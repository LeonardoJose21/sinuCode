from django.db import models
from api.models import Estudiante, Monitor

# -------------------------------------
# ENUM choices
# -------------------------------------

DIFICULTAD_CHOICES = [
    ('facil', 'Fácil'),
    ('medio', 'Medio'),
    ('dificil', 'Difícil'),
]

LENGUAJE_CHOICES = [
    ('cpp', 'C++'),
    ('python', 'Python'),
    ('java', 'Java'),
]

MODALIDAD_CHOICES = [
    ('presencial', 'Presencial'),
    ('virtual', 'Virtual'),
]

ROL_CHOICES = [
    ('estudiante', 'Estudiante'),
    ('monitor', 'Monitor'),
    ('docente', 'Docente'),
]

# -------------------------------------
# CORE MODELS
# -------------------------------------

class ProblemasDeProgramacion(models.Model):
    problema = models.TextField()
    dificultad = models.CharField(max_length=10, choices=DIFICULTAD_CHOICES)
    tema = models.CharField(max_length=100, null=True, blank=True)
    lenguaje = models.CharField(max_length=10, choices=LENGUAJE_CHOICES)

    def __str__(self):
        return f"{self.tema} - {self.dificultad}"

class ProblemasResueltos(models.Model):
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE)
    problema = models.ForeignKey(ProblemasDeProgramacion, on_delete=models.CASCADE)
    retroalimentacion = models.TextField()
    solucion = models.TextField()

    def __str__(self):
        return f"{self.estudiante} -> {self.problema}"

class Monitorias(models.Model):
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE)
    monitor = models.ForeignKey(Monitor, on_delete=models.CASCADE)
    tema = models.CharField(max_length=50)
    modalidad = models.CharField(max_length=20, choices=MODALIDAD_CHOICES)
    fecha = models.DateTimeField()

    def __str__(self):
        return f"{self.tema} ({self.modalidad}) - {self.fecha}"

class Retroalimentacion(models.Model):
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE)
    comentario = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.estudiante} - {self.fecha}"

class EncuestasPreguntas(models.Model):
    pregunta = models.CharField(max_length=250)
    tipo = models.CharField(max_length=50, choices=[('opcion_multiple', 'Opción Múltiple'),
                                                    ('texto_abierto', 'Texto Abierto'),
                                                    ('checkbox', 'Checkbox')],
                                                    null=True, blank=True)
    opciones = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return self.pregunta

class EncuestasRespuestas(models.Model):
    pregunta = models.ForeignKey(EncuestasPreguntas, on_delete=models.CASCADE)
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE)
    respuesta = models.CharField(max_length=250)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.estudiante} - {self.pregunta}"
