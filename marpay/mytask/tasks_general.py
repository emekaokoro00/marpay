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
    # MAKE THIS WORK
    send_mail(
        'Subject here',
        'Here is the message.',
        'nadspart@gmail.com',
        ['emeka.okoro.00@gmail.com'],
        fail_silently=False,
    )
    return True