from django.db import models

# Create your models here.

class user(models.Model):
	name = models.CharField(max_length=8)
	email = models.EmailField()
	pongWins = models.IntegerField()
	pongLoses = models.IntegerField()

class game(models.Model):
	playerRigth = models.CharField()
	scoreRight = models.SmallIntegerField()
	playerLeft = user()
	scoreLeft = models.SmallIntegerField()
	round = models.SmallIntegerField()

