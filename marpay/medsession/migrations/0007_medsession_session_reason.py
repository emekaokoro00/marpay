# Generated by Django 3.0.7 on 2020-07-13 15:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medsession', '0006_medsession_status_to_physician'),
    ]

    operations = [
        migrations.AddField(
            model_name='medsession',
            name='session_reason',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]
