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
# WORKDIR /usr/src/app/marpay

RUN python manage.py collectstatic --noinput
