# myapp/routing.py

from django.urls import path
from .consumers import PongConsumer

websocket_urlpatterns = [
    path('ws/game/', PongConsumer.as_asgi()),
    # path('ws/game/<str:game_id>/', PongConsumer.as_asgi()),
]