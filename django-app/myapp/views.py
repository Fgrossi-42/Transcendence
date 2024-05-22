from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def pong(request):
    return render(request, 'pong.html')

def chat(request):
    return render(request, 'chat.html')

def dashboard(request):
    return render(request, 'dashboard.html')
    
def friends(request):
    return render(request, 'friends.html')

def start(request):
    return render(request, 'start.html')
