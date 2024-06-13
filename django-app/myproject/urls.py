from django.contrib import admin
from django.urls import path, include
from myapp import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),  # Root URL pattern
    path('game/', views.game, name='game'),
    path('gameAI/', views.gameAI, name='gameAI'),
    path('tournament/', views.tournament, name='tournament'),
    path('start/', views.start, name='start'),
    path('tac/', views.tac, name='tac'),
    path('game3D/', views.game3D, name='game3D'),
    path('multiGame/', views.multiGame, name='multiGame'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)