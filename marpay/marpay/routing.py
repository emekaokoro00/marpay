from django.urls import path  # new
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

from medsession.consumers import MedsessionConsumer


application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter([
            path('medsession_consumer/', MedsessionConsumer),
        ])
    )
})