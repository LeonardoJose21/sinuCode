# serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Estudiante

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
        fields = ["user", "nombre", "sexo", "carrera"]

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        estudiante, created = Estudiante.objects.update_or_create(user=user, **validated_data)
        return estudiante
