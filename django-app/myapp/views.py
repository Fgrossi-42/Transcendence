# views.py
from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse

## >-------------------------------------
## PER FLAVIO, CHRISTIAN E GIOELE:
## >-------------------------------------
"""
	In python è utile usare il "typing" --> ovvero da questo:

	def home(request):
		return render(request, 'home.html')

	si passa a questo:

	def home(request: HttpRequest) -> HttpResponse:
		return render(request, 'home.html')

	Vedrete che tutte le funzioncine e i parametri 
	vengono colorati dall'interpreter, (ctrl + shift + P  poi scrivi 'interpreter');
	il codice diventa più intelligibile.
"""

def home(request: HttpRequest) -> HttpResponse:
    return render(request, 'home.html')

def start(request: HttpRequest) -> HttpResponse:
    if request.headers.get('x-requested-with', None) == 'XMLHttpRequest':
        return render(request, 'start.html')
    return render(request, 'home.html')

def game(request: HttpRequest) -> HttpResponse:
    if request.headers.get('x-requested-with', None) == 'XMLHttpRequest':
        return render(request, 'game.html')
    return render(request, 'home.html')

def gameAI(request: HttpRequest) -> HttpResponse:
    if request.headers.get('x-requested-with', None) == 'XMLHttpRequest':
        return render(request, 'gameAI.html')
    return render(request, 'home.html')

def tournament(request: HttpRequest) -> HttpResponse:
    if request.headers.get('x-requested-with', None) == 'XMLHttpRequest':
        return render(request, 'tournament.html')
    return render(request, 'home.html')

def tac(request: HttpRequest) -> HttpResponse:
    if request.headers.get('x-requested-with', None) == 'XMLHttpRequest':
        return render(request, 'tac.html')
    return render(request, 'home.html')

def game3D(request: HttpRequest) -> HttpResponse:
    if request.headers.get('x-requested-with', None) == 'XMLHttpRequest':
        return render(request, 'game3D.html')
    return render(request, 'home.html')