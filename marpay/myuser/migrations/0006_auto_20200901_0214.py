# Generated by Django 3.0.7 on 2020-09-01 02:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myuser', '0005_auto_20200822_1752'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='first_name',
            field=models.CharField(blank=True, max_length=30, verbose_name='first name'),
        ),
    ]