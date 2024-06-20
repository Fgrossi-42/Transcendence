# views.py
import json
from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login , logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from .models import GameHistory  # Import your GameHistory model

# Example data structure for game history
game_history = []

def fetch_game_history(request):
    return JsonResponse({'game_history': game_history})

@csrf_exempt
def record_tic_tac_toe_game(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        game_result = data.get('result')
        # Here you can add more details about the game if needed
        game_history.append({'winner': game_result, 'details': 'Some details about the game'})
        return JsonResponse({'game': {'winner': game_result, 'details': 'Some details about the game'}})
    return JsonResponse({'error': 'Invalid request'}, status=400)


def register_view(request):
    context = {}
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']
        
        if password != confirm_password:
            context['error'] = 'Passwords do not match'
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'status': 'fail', 'error': context['error']})
            else:
                return render(request, 'register.html', context)
        elif User.objects.filter(username=username).exists():
            context['error'] = 'Username already taken'
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'status': 'fail', 'error': context['error']})
            else:
                return render(request, 'register.html', context)
        else:
            user = User.objects.create_user(username=username, password=password)
            user.save()
            
            login(request, user)  # Log the user in after registration
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'status': 'ok'})
            else:
                return redirect('home')  # Redirect to the homepage after successful registration
    
    else:
        if request.headers.get('x-requested-with', None) == 'XMLHttpRequest':
            return render(request, 'register.html')
        return render(request, 'home.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'status': 'ok'})
            else:
                return redirect('/start')
        else:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'status': 'fail'})
            else:
                return render(request, 'login.html', {'error': 'Invalid login'})
    else:
        if request.headers.get('x-requested-with', None) == 'XMLHttpRequest':
            return render(request, 'login.html')
        return render(request, 'home.html')

from django.http import JsonResponse

@login_required
def home(request: HttpRequest) -> HttpResponse:
    return render(request, 'home.html')

@login_required
def start(request: HttpRequest) -> HttpResponse:
    if request.headers.get('x-requested-with', None) == 'XMLHttpRequest':
        return render(request, 'start.html')
    return render(request, 'home.html')

@login_required
def game(request: HttpRequest) -> HttpResponse:
    if request.headers.get('x-requested-with', None) == 'XMLHttpRequest':
        return render(request, 'game.html')
    return render(request, 'home.html')

@login_required
def gameAI(request: HttpRequest) -> HttpResponse:
    if request.headers.get('x-requested-with', None) == 'XMLHttpRequest':
        return render(request, 'gameAI.html')
    return render(request, 'home.html')

@login_required
def tournament(request: HttpRequest) -> HttpResponse:
    if request.headers.get('x-requested-with', None) == 'XMLHttpRequest':
        return render(request, 'tournament.html')
    return render(request, 'home.html')

@login_required
def tac(request: HttpRequest) -> HttpResponse:
    if request.headers.get('x-requested-with', None) == 'XMLHttpRequest':
        return render(request, 'tac.html')
    return render(request, 'home.html')

@login_required
def game3D(request: HttpRequest) -> HttpResponse:
    if request.headers.get('x-requested-with', None) == 'XMLHttpRequest':
        return render(request, 'game3D.html')
    return render(request, 'home.html')

@login_required
def multiGame(request: HttpRequest) -> HttpResponse:
    if request.headers.get('x-requested-with', None) == 'XMLHttpRequest':
        return render(request, 'multiGame.html')
    return render(request, 'home.html')