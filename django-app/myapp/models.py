# In your app's models.py

from django.db import models
from django.contrib.auth.models import User

class GameHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    winner = models.CharField(max_length=1)  # 'X' or 'O'
    details = models.TextField()

    def __str__(self):
        return f"{self.user.username} - Winner: {self.winner}"