import time
from django.core.mail import send_mail

from celery import shared_task


@shared_task
def create_task(task_type):
    time.sleep(int(task_type) * 10)
    return True

@shared_task
def add_number_task(x, y):
    return x + y

@shared_task
def send_email_task(email_address):
    send_mail(
        'Sign Up Complete',
        'Thanks for signing up',
        'nadspart@gmail.com',
        [email_address],
        fail_silently=False,
    )
    return True