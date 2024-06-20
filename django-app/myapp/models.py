from django.db import models
from django.contrib.auth.models import User

class GameHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    winner = models.CharField(max_length=10)
    details = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)  # Add this field

    def __str__(self):
        return f"{self.user.username} - Winner: {self.winner}"
