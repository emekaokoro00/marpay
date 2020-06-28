from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from ..models import MedSession
from myuser.models import Role

import sys

 # sys.stderr.write('\n Return Code is:' + str(the_current_role.id) + ' \n') # to write to console to help debugging
PASSWORD = 'spartan123'       

def create_user(username='user@example.com', password=PASSWORD, current_role_name='customer'):  
    # return get_user_model().objects.create_user(username=username, password=password)
    user = get_user_model().objects.create_user(username=username, password=password)
    
    the_current_role = Role(Role.CUSTOMER)
    the_current_role = the_current_role.set_role_from_name(current_role_name) # initialize to  role 
    the_current_role.save()   # save to role if it doesn't exist, otherwise updates
    user.current_role = the_current_role  # save to role if it doesn't exist, otherwise updates            
    user.save()   
     
    return user

class AuthenticationTest(APITestCase): 
                
    def test_user_can_sign_up(self):
        the_current_role = Role(Role.CUSTOMER)
        response = self.client.post(reverse('sign_up'), data={ # fills up MyUserSerializer meta fields
            'username': 'user@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password1': PASSWORD,
            'password2': PASSWORD,
            'current_role': the_current_role.__str__()
            # 'current_role': the_current_role.set_role_from_name('customer')
        })
        user = get_user_model().objects.last()
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(response.data['id'], user.id)
        self.assertEqual(response.data['username'], user.username)
        self.assertEqual(response.data['first_name'], user.first_name)
        self.assertEqual(response.data['last_name'], user.last_name)
        self.assertEqual(response.data['current_role'], user.current_role.__str__())      
        # self.assertIsNotNone(user.current_role) 

    def test_user_can_log_in(self):
        user = create_user()
        response = self.client.post(reverse('log_in'), data={
            'username': user.username,
            'password': PASSWORD,
        })
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data['username'], user.username)
 
    def test_user_can_log_out(self):
        user = create_user()
        self.client.login(username=user.username, password=PASSWORD)
        response = self.client.post(reverse('log_out'))
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)

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