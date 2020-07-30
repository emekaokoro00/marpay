# marpay/Dockerfile

FROM python:3.8.3-alpine

RUN apk add --update --no-cache \
    g++ gcc libxslt-dev musl-dev python3-dev \
    libffi-dev openssl-dev jpeg-dev zlib-dev 

# mariadb-dev
# RUN pip3 install mysqlclient

ENV LIBRARY_PATH=/lib:/usr/lib

WORKDIR /usr/src/app

COPY ./requirements.txt /usr/src/app

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

COPY . /usr/src/app

# RUN mkdir -p /usr/src/app/marpay
# WORKDIR /usr/src/app

RUN python manage.py collectstatic --noinput
# after copying to static file (from django settings), also copy from root static to marpay static... this is for serving django
# COPY /usr/src/static

# add and run as non-root user
RUN adduser -D myuser
USER myuser

# run daphne
# CMD daphne --bind 0.0.0.0 --port 8000 marpay.asgi:application
CMD daphne --bind 0.0.0.0 --port $PORT marpay.asgi:application
# CMD gunicorn  --bind 0.0.0.0:$PORT marpay.wsgi:application
