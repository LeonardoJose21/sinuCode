# models.py
#app: api
from django.contrib.auth.models import User
from django.db import models
from django.conf import settings

DIFICULTAD_CHOICES = [
    ('facil', 'Fácil'),
    ('medio', 'Medio'),
    ('dificil', 'Difícil'),
]

class Estudiante(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nombre_completo = models.CharField(max_length=100)
    programa_academico = models.CharField(max_length=100, null=True)
    cantidad_ejercicios_resueltos = models.IntegerField(default=0)
    dificultad_predominante = models.CharField(max_length=10, choices=DIFICULTAD_CHOICES, null=True, blank=True)

    def __str__(self):
        return self.nombre_completo

class PersonalAcademico(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nombre_completo = models.CharField(max_length=100)
    rol = models.CharField(max_length=50, choices=[('monitor', 'Monitor'), ('docente', 'Docente')])
    class Meta:
        abstract = True

  

class Monitor(PersonalAcademico):
    def __str__(self):
        return f'Monitor: {self.nombre_completo}'

class Docente(PersonalAcademico):
    def __str__(self):
        return f'Docente: {self.nombre_completo}'