from django.contrib import admin
from django.urls import path
from myapp import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),  # Root URL pattern
    path('game/', views.game, name='game'),
    path('gameVsAI/', views.gameVsAI, name='gameVsAI'),
    path('gameVstourn/', views.gameVstourn, name='gameVstourn'),
    path('chat/', views.chat, name='chat'),
    path('start/', views.start, name='start'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('friends/', views.friends, name='friends'),
]
