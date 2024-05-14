# myapp/urls.py
# from django.urls import path
# from django.contrib import admin
# from django.urls import path, include
# from . import views
# from django.conf import settings
# from django.conf.urls.static import static

# urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# urlpatterns = [
#     path('', views.index, name='index'),
#     path('game/', views.game_view, name='game'),
#     # path('', views.index, name='game'),
# ]

# myapp/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('game/', views.game_view, name='game'),
]

# Importa le impostazioni solo dopo aver definito urlpatterns
from django.conf import settings
from django.conf.urls.static import static

# Aggiungi configurazioni per servire file statici solo in modalità di sviluppo
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
