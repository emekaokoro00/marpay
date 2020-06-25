"""
Django settings for marpay project.

Generated by 'django-admin startproject' using Django 3.0.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os
from dotenv import load_dotenv
from pathlib import Path  # python3 only

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'cb2@grv9u3lw(s)z1454egkf88jcbug-x*)^(ewlr95djh_ici'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# ALLOWED_HOSTS = []
ALLOWED_HOSTS = [u'192.168.56.56', u'localhost', u'10.0.2.2', u'192.168.1.5', u'2e57df7ab655.ngrok.io']
# 192.168.56.56 is the local address, also browseable from host if listening setup
# 10.0.2.2 is the host computer emulator address
# 192.168.1.5' is the host computer ip address on a WLAN... this is for an actual phont to browse
# .....ngrok.io is the ngrok address.. will always change per session use [./ngrok http 192.168.56.56:8000] in /home/emekaokoro]


load_dotenv() # calls the .env file in the same folder as this settings.py

# Application definition

INSTALLED_APPS = [
    'accounts.apps.AccountsConfig',
    'myuser.apps.MyUserConfig',
    'medsession.apps.MedSessionConfig',
    'rest_framework',
    'channels',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'marpay.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# To disable the browseable API in production with this configuration:
#===============================================================================
# REST_FRAMEWORK = {
#     'DEFAULT_RENDERER_CLASSES': (
#         'rest_framework.renderers.JSONRenderer',
#     )
# }

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication'
    ]
}
#===============================================================================


WSGI_APPLICATION = 'marpay.wsgi.application'

ASGI_APPLICATION = 'marpay.routing.application'


# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases
#===============================================================================
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#     }
# }
#===============================================================================           
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'marpay_db',
        'USER': 'root',
        'PASSWORD': 'spartan123',
        'HOST': 'localhost',
        'PORT': '',
        'ATOMIC_REQUESTS': True   # enables transaction saving... all or none
    }
             
}

# Redis -- in-memory data store
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379')
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [REDIS_URL],
        },
    },
}

AUTH_USER_MODEL = 'myuser.MyUser'

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "templates/static"),
]

#===============================================================================
# LOGIN_REDIRECT_URL = '/'
# LOGOUT_REDIRECT_URL = '/'
#===============================================================================
LOGIN_URL = 'home' # login url when user not authenticated
LOGIN_REDIRECT_URL = 'home'
LOGOUT_REDIRECT_URL = 'home'
