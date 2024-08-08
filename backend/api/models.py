# models.py
from django.contrib.auth.models import User
from django.db import models

class Estudiante(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    sexo = models.CharField(max_length=1, choices=[('M', 'Masculino'), ('F', 'Femenino')])
    carrera = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.nombre
