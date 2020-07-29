
FROM nginx:1.17.5-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY /include.websocket /etc/nginx/app/include.websocket
COPY /include.forwarded /etc/nginx/app/include.forwarded

COPY ./default.conf /etc/nginx/conf.d/default.conf



CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'