# serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from playground.models import ProblemasResueltos
from .models import Docente, Estudiante, Monitor 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class EstudianteSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Estudiante
        fields = ["user", "nombre_completo", "programa_academico", 
                  "cantidad_ejercicios_resueltos", "dificultad_predominante"]

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        estudiante, created = Estudiante.objects.update_or_create(user=user, **validated_data)
        return estudiante
    
class ProblemasResueltosSerializer(serializers.ModelSerializer):
    problema_nombre = serializers.CharField(source='problema.problema')  # if your field is called "problema"
    class Meta:
        model = ProblemasResueltos
        fields = ['id', 'problema_nombre', 'retroalimentacion', 'solucion'] 

class MonitorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Monitor
        fields = ['user', 'nombre_completo', 'rol']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        return Monitor.objects.create(user=user, **validated_data)


class DocenteSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Docente
        fields = ['user', 'nombre_completo', 'rol']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        return Docente.objects.create(user=user, **validated_data)