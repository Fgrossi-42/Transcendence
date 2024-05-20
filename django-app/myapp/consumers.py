# myapp/consumers.py

import json
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from random import randint, choice
import time

# Direzioni di movimento
DIRECTION = {
	'IDLE': 0,
	'UP': 1,
	'DOWN': 2,
	'LEFT': 3,
	'RIGHT': 4
}

rounds = [5, 5, 3, 3, 2]

class Ball:
	def __init__(self, width, height, canvas_width, canvas_height):
		self.width = width
		self.height = height
		self.canvas_width = canvas_width
		self.canvas_height = canvas_height
		self.x = (canvas_width / 2) - (self.width / 2)
		self.y = (canvas_height / 2) - (self.height / 2)
		self.moveX = DIRECTION['IDLE']
		self.moveY = DIRECTION['IDLE']
		self.speed = 7

	def reset(self):
		self.x = (self.canvas_width / 2) - (self.width / 2)
		self.y = (self.canvas_height / 2) - (self.height / 2)
		self.moveX = DIRECTION['IDLE']
		self.moveY = DIRECTION['IDLE']
		self.speed = 7

class Player:
	def __init__(self, side, canvas_width, canvas_height):
		self.width = 18
		self.height = 180
		self.x = 150 if side == 'left' else canvas_width - 150
		self.y = (canvas_height / 2) - (self.height / 2)
		self.score = 0
		self.move = DIRECTION['IDLE']
		self.speed = 8 if side == 'left' else 5

class Game:
	def __init__(self, canvas_width, canvas_height):
		self.canvas_width = canvas_width
		self.canvas_height = canvas_height
		self.playerLeft = Player('left', canvas_width, canvas_height)
		self.playerRight = Player('right', canvas_width, canvas_height)
		self.ball = Ball(25, 25, canvas_width, canvas_height)
		self.running = False
		self.over = False
		self.turn = self.playerRight
		self.timer = time.time()
		self.round = 0
		self.color = '#212529'

	def update(self):
		if not self.over:
			# Gestisci collisioni e movimenti
			if self.ball.x <= 0:
				self.reset_turn(self.playerRight, self.playerLeft)
			if self.ball.x >= self.canvas_width - self.ball.width:
				self.reset_turn(self.playerLeft, self.playerRight)
			if self.ball.y <= 0:
				self.ball.moveY = DIRECTION['DOWN']
			if self.ball.y >= self.canvas_height - self.ball.height:
				self.ball.moveY = DIRECTION['UP']

			if self.playerLeft.move == DIRECTION['UP']:
				self.playerLeft.y -= self.playerLeft.speed
			elif self.playerLeft.move == DIRECTION['DOWN']:
				self.playerLeft.y += self.playerLeft.speed

			if self.turn and time.time() - self.timer > 1:
				self.ball.moveX = DIRECTION['LEFT'] if self.turn == self.playerLeft else DIRECTION['RIGHT']
				self.ball.moveY = choice([DIRECTION['UP'], DIRECTION['DOWN']])
				self.turn = None

			if self.playerLeft.y <= 0:
				self.playerLeft.y = 0
			elif self.playerLeft.y >= (self.canvas_height - self.playerLeft.height):
				self.playerLeft.y = (self.canvas_height - self.playerLeft.height)

			if self.ball.moveY == DIRECTION['UP']:
				self.ball.y -= (self.ball.speed / 1.5)
			elif self.ball.moveY == DIRECTION['DOWN']:
				self.ball.y += (self.ball.speed / 1.5)

			if self.ball.moveX == DIRECTION['LEFT']:
				self.ball.x -= self.ball.speed
			elif self.ball.moveX == DIRECTION['RIGHT']:
				self.ball.x += self.ball.speed

			if self.playerRight.move == DIRECTION['UP']:
				self.playerRight.y -= self.playerRight.speed
			elif self.playerRight.move == DIRECTION['DOWN']:
				self.playerRight.y += self.playerRight.speed

			if self.playerRight.y <= 0:
				self.playerRight.y = 0
			elif self.playerRight.y >= (self.canvas_height - self.playerRight.height):
				self.playerRight.y = (self.canvas_height - self.playerRight.height)

			if self.ball.x - self.ball.width <= self.playerLeft.x and self.ball.x >= self.playerLeft.x - self.playerLeft.width:
				if self.ball.y <= self.playerLeft.y + self.playerLeft.height and self.ball.y + self.ball.height >= self.playerLeft.y:
					self.ball.x = (self.playerLeft.x + self.ball.width)
					self.ball.moveX = DIRECTION['RIGHT']

			if self.ball.x - self.ball.width <= self.playerRight.x and self.ball.x >= self.playerRight.x - self.playerRight.width:
				if self.ball.y <= self.playerRight.y + self.playerRight.height and self.ball.y + self.ball.height >= self.playerRight.y:
					self.ball.x = (self.playerRight.x - self.ball.width)
					self.ball.moveX = DIRECTION['LEFT']

		if self.playerLeft.score == rounds[self.round]:
			if not rounds[self.round + 1]:
				self.over = True
				self.end_game_menu('Winner!')
			else:
				self.playerLeft.score = self.playerRight.score = 0
				self.playerLeft.speed += 0.5
				self.playerRight.speed += 1
				self.ball.speed += 1
				self.round += 1

		elif self.playerRight.score == rounds[self.round]:
			self.over = True
			self.end_game_menu('Game Over!')

	def reset_turn(self, victor, loser):
		self.ball.reset()
		self.turn = loser
		self.timer = time.time()
		victor.score += 1

	def end_game_menu(self, text):
		self.running = False
		self.color = '#212529'
		# Inviare il messaggio di fine gioco al client
		self.send_message({'event': 'end', 'message': text})

	def to_dict(self):
		return {
			'playerLeft': {
				'x': self.playerLeft.x,
				'y': self.playerLeft.y,
				'score': self.playerLeft.score,
				'move': self.playerLeft.move
			},
			'playerRight': {
				'x': self.playerRight.x,
				'y': self.playerRight.y,
				'score': self.playerRight.score,
				'move': self.playerRight.move
			},
			'ball': {
				'x': self.ball.x,
				'y': self.ball.y
			}
		}

	def send_message(self, message):
		self.send(text_data=json.dumps(message))


class PongConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.game = Game(2000, 1100)
        self.send(text_data=json.dumps({'event': 'connected', 'message': 'Welcome to Pong!'}))

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        data = json.loads(text_data)
        if data['event'] == 'move':
            if data['side'] == 'left':
                self.game.playerLeft.move = DIRECTION[data['direction']]
            elif data['side'] == 'right':
                self.game.playerRight.move = DIRECTION[data['direction']]
        self.game.update()
        self.send(text_data=json.dumps(self.game.to_dict()))

# class PongConsumer(AsyncWebsocketConsumer):
# 	def __init__(self, *args, **kwargs):
# 		super().__init__(args, kwargs)
# 		self.game_id = None
# 		self.group_name = None

# 	async def connect(self):
#         # Code to run when the WebSocket is handshaking as part of the connection process.
# 		self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
# 		self.group_name = self.game_id
# 		self.game = Game(2000, 1100)
# 		print(f"socket game_id: {self.game_id}")
# 		await self.channel_layer.group_add(self.group_name, self.channel_name)
# 		await self.accept()
# 		# self.send(text_data=json.dumps({'event': 'connected', 'message': 'Welcome to Pong!'}))

# 	async def disconnect(self, close_code):
# 		await self.channel_layer.group_discard(self.group_name, self.channel_name)
# 		# pass

# 	async def receive(self, text_data):
# 		print('RECEIVED text_data', text_data)
# 		data = json.loads(text_data)
# 		if data['event'] == 'move':
# 			if data['side'] == 'left':
# 				self.game.playerLeft.move = DIRECTION[data['direction']]
# 			elif data['side'] == 'right':
# 				self.game.playerRight.move = DIRECTION[data['direction']]
# 		self.game.update()
# 		await self.channel_layer.group_send(self.group_name, json.dumps(self.game.to_dict()))

# 	async def create(self, event):
# 		# Code to run when the server send message to the WebSocket.
# 		await self.send(text_data=json.dumps(event))
