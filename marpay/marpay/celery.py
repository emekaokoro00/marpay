import os

from celery import Celery


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "marpay.settings")
app = Celery("marpay")
app.config_from_object("django.conf:settings", namespace="CELERY")
# app.conf.update(BROKER_URL=os.getenv("REDIS_URL", "redis://localhost:6379"), CELERY_RESULT_BACKEND=os.getenv("REDIS_URL", "redis://localhost:6379")) # for production?
app.autodiscover_tasks()