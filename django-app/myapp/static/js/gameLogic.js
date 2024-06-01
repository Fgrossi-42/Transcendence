// Global Variables
var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};


// The ball object (The cube that bounces back and forth)
var Ball = {
    new: function () {
        return {
            width: 25,
            height: 25,
            x: (this.canvas.width / 2) - 9,
            y: (this.canvas.height / 2) - 9,
            moveX: DIRECTION.IDLE,
            moveY: DIRECTION.IDLE,
            speed: 8
        };
    }
};

// The paddle object (The two lines that move up and down)
var Paddle = {
    new: function (side) {
        return {
            width: 18,
            height: 180,
            x: side === 'left' ? 150 : this.canvas.width - 150,
            y: (this.canvas.height / 2) - 35,
            score: 0,
            move: DIRECTION.IDLE,
            speed: 8
        };
    }
};

export const Pong = {
    initialize: function (playerLeftName, playerRightName, rounds) {

		this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
		
        this.canvas.width = 2000;
        this.canvas.height = 1100;

        this.canvas.style.width = (this.canvas.width / 2) + 'px';
        this.canvas.style.height = (this.canvas.height / 2) + 'px';
		
        this.playerLeft = Paddle.new.call(this, 'left');
        this.playerRight = Paddle.new.call(this, 'right');
        this.ball = Ball.new.call(this);
		
        this.playerRight.speed = 8;
        this.running = this.over = false;
        this.turn = this.playerRight;
        this.timer = this.round = 0;
        this.color = '#212529';
    
        this.playerLeft.name = playerLeftName;
        this.playerRight.name = playerRightName;
		this.rounds = rounds

        // Bind methods to the current context
        this.menu = this.menu.bind(this);
        this.listen = this.listen.bind(this);
        this.loop = this.loop.bind(this);
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);
        this.endGameMenu = this.endGameMenu.bind(this);
        this._turnDelayIsOver = this._turnDelayIsOver.bind(this);
        this._resetTurn = this._resetTurn.bind(this);

        this.menu();
        this.listen();
    },

    finalize: function() {
        // Clean up resources and reset state
        this.running = false;
        this.over = false;
        this.turn = null;
        this.timer = this.round = 0;
        this.playerLeft = null;
        this.playerRight = null;
        this.ball = null;
        this.canvas = null;
        this.context = null;
        this.color = '#212529';
    },

    endGameMenu: function (text) {
		console.log("calling endGameMenu with text", text);
        this.context.font = '45px Courier New';
        this.context.fillStyle = this.color;

        this.context.fillRect(
            this.canvas.width / 2 - 350,
            this.canvas.height / 2 - 48,
            700,
            100
        );

        this.context.fillText(text,
            this.canvas.width / 2,
            this.canvas.height / 2 + 15
        );
    },

    menu: function () {
        this.draw();

        this.context.font = '50px Courier New';
        this.context.fillStyle = this.color;

        this.context.fillRect(
            this.canvas.width / 2 - 350,
            this.canvas.height / 2 - 48,
            700,
            100
        );

        this.context.fillStyle = '#ffffff';

        this.context.fillText('Press any key to begin\n within 10 seconds',
            this.canvas.width / 2,
            this.canvas.height / 2 + 15
        );
    },

    update: function () {
        if (!this.over) {
            this.handleBallBoundaries();
            this.handlePaddleMovement(this.playerLeft);
            this.handlePaddleMovement(this.playerRight);

            if (this._turnDelayIsOver.call(this) && this.turn) {
                this.ball.moveX = this.turn === this.playerLeft ? DIRECTION.LEFT : DIRECTION.RIGHT;
                this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
                this.ball.y = Math.floor(Math.random() * (this.canvas.height - 200)) + 200;
                this.turn = null;
            }

            this.moveBall();
            this.handleBallCollisions();

            this.checkRoundWinner();
        }
    },

    handleBallBoundaries: function() {
        if (this.ball.x <= 0) this._resetTurn.call(this, this.playerRight, this.playerLeft);
        if (this.ball.x >= this.canvas.width - this.ball.width) this._resetTurn.call(this, this.playerLeft, this.playerRight);
        if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
        if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;
    },

    handlePaddleMovement: function(paddle) {
        if (paddle.move === DIRECTION.UP) paddle.y -= paddle.speed;
        else if (paddle.move === DIRECTION.DOWN) paddle.y += paddle.speed;

        if (paddle.y <= 0) paddle.y = 0;
        else if (paddle.y >= this.canvas.height - paddle.height) paddle.y = this.canvas.height - paddle.height;
    },

    moveBall: function() {
        if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
        else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
        if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
        else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;
    },

    handleBallCollisions: function() {
        this.handlePaddleBallCollision(this.playerLeft, DIRECTION.RIGHT);
        this.handlePaddleBallCollision(this.playerRight, DIRECTION.LEFT);
    },

    handlePaddleBallCollision: function(paddle, direction) {
        if (this.ball.x - this.ball.width <= paddle.x && this.ball.x >= paddle.x - paddle.width) {
            if (this.ball.y <= paddle.y + paddle.height && this.ball.y + this.ball.height >= paddle.y) {
                this.ball.x = (direction === DIRECTION.RIGHT) ? (paddle.x + this.ball.width) : (paddle.x - this.ball.width);
                this.ball.moveX = direction;
            }
        }
    },

    checkRoundWinner: function() {
        if (this.playerLeft.score === this.rounds[this.round]) {
            if (!this.rounds[this.round + 1]) {
                this.over = true;
				this.endGameMenu(this.playerLeftName + 'Wins!');
                // setTimeout(function () { this.endGameMenu(this.playerLeftName + 'Wins!'); }, 1000);
            } else {
                this.advanceToNextRound();
            }
        } else if (this.playerRight.score === this.rounds[this.round]) {
            if (!this.rounds[this.round + 1]) {
                this.over = true;
				this.endGameMenu(this.playerRightName + 'Wins!');
                // setTimeout(function () { this.endGameMenu(this.playerRightName + 'Wins!'); }, 1000);
            } else {
                this.advanceToNextRound();
            }
        }
    },

    advanceToNextRound: function() {
        this.color = this.color;
        this.playerLeft.score = this.playerRight.score = 0;
        this.playerLeft.speed += 1;
        this.playerRight.speed += 1;
        this.ball.speed += 1;
        this.round += 1;
    },

    draw: function () {
        // Clear the Canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the background
        this.context.fillStyle = this.color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the paddles and ball
        this.context.fillStyle = '#ffffff';
        this.drawPaddle(this.playerLeft);
        this.drawPaddle(this.playerRight);
        this.drawBall();

        // Draw the net (Line in the middle)
        this.drawNet();

        // Draw the scores
        this.context.font = '100px Courier New';
        this.context.textAlign = 'center';
        this.context.fillText(this.playerLeft.score.toString(), (this.canvas.width / 2) - 300, 200);
        this.context.fillText(this.playerRight.score.toString(), (this.canvas.width / 2) + 300, 200);

        // Draw the round number
        this.context.font = '30px Courier New';
        this.context.fillText('Round ' + (this.round + 1), (this.canvas.width / 2), 35);

        // Draw the current round score
        this.context.font = '40px Courier';
        this.context.fillText(this.rounds[this.round] ? this.rounds[this.round] : this.rounds[this.round - 1], (this.canvas.width / 2), 100);
    },

    drawPaddle: function(paddle) {
        this.context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    },

    drawBall: function() {
        if (this._turnDelayIsOver.call(this)) {
            this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
        }
    },

    drawNet: function() {
        this.context.beginPath();
        this.context.setLineDash([7, 15]);
        this.context.moveTo((this.canvas.width / 2), this.canvas.height - 140);
        this.context.lineTo((this.canvas.width / 2), 140);
        this.context.lineWidth = 10;
        this.context.strokeStyle = '#ffffff';
        this.context.stroke();
    },

    loop: function () {
        this.update();
        this.draw();

        if (!this.over) requestAnimationFrame(this.loop);
    },

    listen: function () {
        document.addEventListener('keydown', (key) => {
            if (this.running === false) {
                this.running = true;
                window.requestAnimationFrame(this.loop);
                return;
            }
            key.preventDefault();

            if (key.key === 'w') this.playerLeft.move = DIRECTION.UP;
            if (key.key === 'o') this.playerRight.move = DIRECTION.UP;
            if (key.key === 's') this.playerLeft.move = DIRECTION.DOWN;
            if (key.key === 'k') this.playerRight.move = DIRECTION.DOWN;
        });

        document.addEventListener('keyup', (key) => {
            if (key.key === 'w' || key.key === 's') this.playerLeft.move = DIRECTION.IDLE;
            if (key.key === 'o' || key.key === 'k') this.playerRight.move = DIRECTION.IDLE;
        });
    },

	// Record Match Winner
	// function recordMatchWinner(winner) {
	// 	matchResults.push(winner);
	// 	currentMatch++;
	// 	startNextMatch();
	// }

    _resetTurn: function (victor, loser) {
        this.ball = Ball.new.call(this);
        this.turn = loser;
        this.timer = (new Date()).getTime();
        victor.score++;

        if (victor.score === this.rounds[this.round]) {
            if (!this.rounds[this.round + 1]) {
                this.over = true;
                let winnerName = victor === this.playerLeft ? this.playerLeft.name : this.playerRight.name;

				this.endGameMenu(winnerName + ' Wins!');
				// this.recordMatchWinner(winnerName);

                // setTimeout(function () {
                //     this.endGameMenu(winnerName + ' Wins!');
                //     recordMatchWinner(winnerName);
                // }, 10000);
            } else {
                this.advanceToNextRound();
            }
        }
    },

    _turnDelayIsOver: function () {
        return ((new Date()).getTime() - this.timer >= 1000);
    },
};
