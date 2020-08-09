# Generated by Django 3.0.7 on 2020-08-08 17:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medsession', '0007_medsession_session_reason'),
    ]

    operations = [
        migrations.AlterField(
            model_name='medsession',
            name='status',
            field=models.CharField(choices=[('REQUESTED', 'REQUESTED'), ('STARTED', 'STARTED'), ('IN_PROGRESS', 'IN_PROGRESS'), ('COMPLETED', 'COMPLETED'), ('CANCELLED', 'CANCELLED')], default='REQUESTED', max_length=20),
        ),
        migrations.AlterField(
            model_name='medsession',
            name='status_to_physician',
            field=models.CharField(choices=[('REQUESTED', 'REQUESTED'), ('STARTED', 'STARTED'), ('IN_PROGRESS', 'IN_PROGRESS'), ('COMPLETED', 'COMPLETED'), ('CANCELLED', 'CANCELLED')], default='REQUESTED', max_length=20),
        ),
    ]
