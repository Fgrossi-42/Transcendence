# myapp/views.py
from django.shortcuts import render

def index(request):
    return render(request, 'home/index.html')

def game_view(request):
    return render(request, 'game/index.html')