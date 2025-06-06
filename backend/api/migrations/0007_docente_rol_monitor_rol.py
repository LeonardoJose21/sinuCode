# Generated by Django 5.0.6 on 2025-05-04 16:58

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_rename_nombre_estudiante_nombre_completo_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='docente',
            name='rol',
            field=models.CharField(choices=[('monitor', 'Monitor'), ('docente', 'Docente')], default=django.utils.timezone.now, max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='monitor',
            name='rol',
            field=models.CharField(choices=[('monitor', 'Monitor'), ('docente', 'Docente')], default='monitor', max_length=50),
            preserve_default=False,
        ),
    ]
