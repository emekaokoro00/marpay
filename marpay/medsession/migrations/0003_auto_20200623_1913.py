# Generated by Django 3.0.7 on 2020-06-23 19:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('medsession', '0002_auto_20200623_1631'),
    ]

    operations = [
        migrations.AddField(
            model_name='medsession',
            name='session_physician',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='session_physician', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='medsession',
            name='session_telehealthworker',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='session_telehealthworker', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='medsession',
            name='session_customer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='session_customer', to=settings.AUTH_USER_MODEL),
        ),
    ]
