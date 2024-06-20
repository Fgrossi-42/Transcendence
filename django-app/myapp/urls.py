# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('start/', views.start, name='start'),
    path('game/', views.game, name='game'),
    path('gameAI/', views.gameAI, name='gameAI'),
    path('tournament/', views.tournament, name='tournament'),
    path('tac/', views.tac, name='tac'),
    path('game3D/', views.game3D, name='game3D'),
    path('multiGame/', views.multiGame, name='multiGame'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('fetch_game_history/', views.fetch_game_history, name='fetch_game_history'),
    path('record_tic_tac_toe_game/', views.record_tic_tac_toe_game, name='record_tic_tac_toe_game'),
]