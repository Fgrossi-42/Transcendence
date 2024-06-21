# views.py
import json
import logging
from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login , logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import IntegrityError

# Set up logging
logger = logging.getLogger(__name__)

def register_view(request):
    context = {}
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']
        
        logger.debug(f"Attempting to register user: {username}")

        if password != confirm_password:
            context['error'] = 'Passwords do not match'
            logger.debug("Passwords do not match")
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'status': 'fail', 'error': context['error']})
            else:
                return render(request, 'register.html', context)
        elif User.objects.filter(username=username).exists():
            context['error'] = 'Username already taken'
            logger.debug(f"Username {username} already taken")
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'status': 'fail', 'error': context['error']})
            else:
                return render(request, 'register.html', context)
        else:
            try:
                user = User.objects.create_user(username=username, password=password)
                user.save()
                login(request, user)  # Log the user in after registration
                logger.debug(f"User {username} created and logged in")
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({'status': 'ok'})
                else:
                    return redirect('home')  # Redirect to the homepage after successful registration
            except IntegrityError as e:
                context['error'] = 'Username already taken'
                logger.error(f"IntegrityError: Username {username} already taken during creation. Exception: {e}")
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({'status': 'fail', 'error': context['error']})
                else:
                    return render(request, 'register.html', context)
            except Exception as e:
                logger.error(f"Unexpected error during registration: {e}")
                context['error'] = 'An unexpected error occurred.'
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({'status': 'error', 'error': context['error']})
                else:
                    return render(request, 'register.html', context)
    else:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return render(request, 'register.html') 
        return render(request, 'home.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        
        logger.debug(f"Attempting to login user: {username}")
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            logger.debug(f"User {username} logged in successfully")
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'status': 'ok'})
            else:
                return redirect('/start')
        else:
            logger.debug(f"Failed login attempt for user: {username}")
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'status': 'fail', 'error': 'Invalid login'})
            else:
                return render(request, 'login.html', {'error': 'Invalid login'})
    else:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return render(request, 'login.html')
        return render(request, 'home.html')

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