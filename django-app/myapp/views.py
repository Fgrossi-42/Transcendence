# views.py
from django.shortcuts import render
from django.http import JsonResponse

def home(request):
    return render(request, 'home.html')

def start(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return render(request, 'start.html')
    return render(request, 'home.html')

def game(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return render(request, 'game.html')
    return render(request, 'home.html')

def chat(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return render(request, 'chat.html')
    return render(request, 'home.html')

def dashboard(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return render(request, 'dashboard.html')
    return render(request, 'home.html')

def friends(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return render(request, 'friends.html')
    return render(request, 'home.html')
