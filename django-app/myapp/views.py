# myapp/views.py
from django.shortcuts import render
from myapp.my_logger import logger

def index(request):
    logger.debug("calling index render in myapp/views.py")
    return render(request, 'home/index.html')

def game_view(request):
    logger.debug("calling game_view render in myapp/views.py")
    return render(request, 'game/index.html')
