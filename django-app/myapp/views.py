# views.py
from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login , logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

def register_view(request):
    context = {}
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']
        
        if password != confirm_password:
            context['error'] = 'Passwords do not match'
        elif User.objects.filter(username=username).exists():
            context['error'] = 'Username already taken'
        else:
            user = User.objects.create_user(username=username, password=password)
            user.save()
            
            login(request, user)  # Log the user in after registration
            return redirect('home')  # Redirect to the homepage after successful registration
    
    return render(request, 'register.html', context)

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
        return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('login')  # Redirect to login page after logout

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