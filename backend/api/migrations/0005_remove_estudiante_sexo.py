# Generated by Django 5.0.6 on 2025-05-04 01:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_remove_estudiante_nivel_actual_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='estudiante',
            name='sexo',
        ),
    ]
