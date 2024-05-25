from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def game(request):
    return render(request, 'game.html')

def chat(request):
    return render(request, 'chat.html')

def dashboard(request):
    return render(request, 'dashboard.html')
    
def friends(request):
    return render(request, 'friends.html')

def start(request):
    return render(request, 'start.html')
