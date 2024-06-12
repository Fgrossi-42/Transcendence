from django.contrib import admin
from django.urls import path
from myapp import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),  # Root URL pattern
    path('game/', views.game, name='game'),
    path('gameAI/', views.gameAI, name='gameAI'),
    path('tournament/', views.tournament, name='tournament'),
    path('start/', views.start, name='start'),
    path('tac/', views.tac, name='tac'),
    path('game3D/', views.game3D, name='game3D'),
]