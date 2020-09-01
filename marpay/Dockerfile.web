# marpay/Dockerfile

FROM python:3.8.3-alpine

RUN apk add --update --no-cache \
    g++ gcc libxslt-dev musl-dev python3-dev \
    libffi-dev openssl-dev jpeg-dev zlib-dev 

ENV LIBRARY_PATH=/lib:/usr/lib

# set environment variables
# Prevents Python from writing pyc files to disc and from buffering stdout and stderr 
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

COPY ./requirements.txt /usr/src/app

# for postgres dependencies... psycopg2
RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

COPY . /usr/src/app

RUN python manage.py collectstatic --noinput
# RUN python manage.py makemigrations
# RUN python manage.py migrate

# VOLUME /usr/src/app/static #volume is not supported

# add and run as non-root user
RUN adduser -D myuser
USER myuser

# run daphne
# CMD daphne --bind 0.0.0.0 --port 8000 marpay.asgi:application
CMD daphne --bind 0.0.0.0 --port $PORT marpay.asgi:application
# CMD gunicorn  --bind 0.0.0.0:$PORT marpay.wsgi:application
