# models.py

from django.db import models

class CodingProblem(models.Model):
    DIFICULTAD_CHOICES = [
        ('facil', 'Fácil'),
        ('medio', 'Medio'),
        ('dificil', 'Difícil')
    ]
    
    LENGUAJE_CHOICES = [
        ('cpp', 'C++'),
        ('python', 'Python'),
        ('java', 'Java')
    ]

    id_problema = models.AutoField(primary_key=True)
    problema = models.TextField()
    dificultad = models.CharField(max_length=10, choices=DIFICULTAD_CHOICES)
    tema = models.CharField(max_length=100)
    lenguaje = models.CharField(max_length=10, choices=LENGUAJE_CHOICES)  # New field

    def __str__(self):
        return f"{self.tema} ({self.dificultad})"

