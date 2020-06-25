from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from ..models import MedSession


PASSWORD = 'spartan123'
def create_user(username='user@example.com', password=PASSWORD):
    return get_user_model().objects.create_user(username=username, password=password)

class HttpMedSessionTest(APITestCase):

    def setUp(self):
        self.user = create_user()
        self.client.login(username=self.user.username, password=PASSWORD) 

    def test_user_can_list_medsessions(self):
        medsessions = [
            MedSession.objects.create(session_address='A', session_customer=self.user),
            MedSession.objects.create(session_address='B', session_customer=self.user)
        ]
        response = self.client.get(reverse('medsession:medsession_list'))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        exp_medsession_ids = [str(medsession.id) for medsession in medsessions]
        act_medsession_ids = [medsession.get('id') for medsession in response.data]
        self.assertCountEqual(exp_medsession_ids, act_medsession_ids)

    def test_user_can_retrieve_medsession_by_id(self):
        medsession = MedSession.objects.create(session_address='A', session_customer=self.user)
        response = self.client.get(medsession.get_absolute_url())
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(str(medsession.id), response.data.get('id'))