# In your app's models.py

from django.db import models
from django.contrib.auth.models import User

class GameHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    winner = models.CharField(max_length=1, choices=[('X', 'X'), ('O', 'O')])
    date_played = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Game played by {self.user.username} on {self.date_played}"
