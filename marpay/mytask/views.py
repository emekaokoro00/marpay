from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from celery.result import AsyncResult

from .tasks_general import create_task, send_email_task

@csrf_exempt
def run_task(request):
    if request.POST:
        task_type = request.POST.get("type")
        task = create_task.delay(int(task_type))
        # task = add_number_task.delay(13,6)
        return JsonResponse({"task_id": task.id}, status=202)
    return JsonResponse({"task_id": "nothing"}, status=202)

@csrf_exempt
def get_status(request, task_id):
    task_result = AsyncResult(task_id)
    result = {
        "task_id": task_id,
        "task_status": task_result.status,
        "task_result": task_result.result
    }
    return JsonResponse(result, status=200)

@csrf_exempt
def send_email(email_adress):    
    # send with sendgrid
    task = send_email_task.delay(email_adress)
    return True