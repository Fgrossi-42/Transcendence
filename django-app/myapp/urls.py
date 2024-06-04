# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('start/', views.start, name='start'),
    path('game/', views.game, name='game'),
    path('gameVsAI/', views.gameVsAI, name='gameVsAI'),
    path('gameVstourn/', views.gameVstourn, name='gameVstourn'),
    path('chat/', views.chat, name='chat'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('friends/', views.friends, name='friends'),
]