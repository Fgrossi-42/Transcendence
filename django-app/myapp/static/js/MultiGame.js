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
            x: (this.canvas.width / 2) - 12.5,
            y: (this.canvas.height / 2) - 12.5,
            moveX: DIRECTION.IDLE,
            moveY: DIRECTION.IDLE,
            speed: 12
        };
    }
};

// The paddle object (The two lines that move up and down)
var Paddle = {
    new: function (side, position) {
        return {
            width: 18,
            height: 180,
            x: side === 'left' ? 150 + (position * 50) : this.canvas.width - 150 - (position * 50),
            y: (this.canvas.height / 2) - 90,
            score: 0,
            move: DIRECTION.IDLE,
            speed: 8
        };
    }
};

var Game = {
    initialize: function (playerLeftName, playerRightName, rounds) {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');

        this.canvas.width = 2000;
        this.canvas.height = 1100;

        this.canvas.style.width = (this.canvas.width / 2) + 'px';
        this.canvas.style.height = (this.canvas.height / 2) + 'px';

        this.playerLeft = Paddle.new.call(this, 'left', 0);
        this.playerLeft2 = Paddle.new.call(this, 'left', 1);  // Additional left paddle
        this.playerRight = Paddle.new.call(this, 'right', 0);
        this.playerRight2 = Paddle.new.call(this, 'right', 1); // Additional right paddle
        this.ball = Ball.new.call(this);

        this.playerLeft.speed = 8;
        this.playerLeft2.speed = 8;  // Speed for the additional left paddle
        this.playerRight.speed = 8;
        this.playerRight2.speed = 8; // Speed for the additional right paddle

        this.running = this.over = false;
        this.turn = this.playerRight;
        this.timer = this.round = 0;
        this.color = '#212529';

        this.playerLeft.name = playerLeftName;
        this.playerRight.name = playerRightName;
        this.rounds = rounds;

        Pong.menu();
        Pong.listen();
        setCurrentGame(this);
    },

    finalize: function() {
        this.running = false;
        this.over = false;
        this.turn = null;
        this.timer = this.round = 0;
        this.playerLeft = null;
        this.playerLeft2 = null;  // Finalize additional left paddle
        this.playerRight = null;
        this.playerRight2 = null; // Finalize additional right paddle
        this.ball = null;
        this.canvas = null;
        this.context = null;
        this.color = '#212529';
    },

    endGameMenu: function (text) {
        Pong.context.font = '45px Courier New';
        Pong.context.fillStyle = this.color;

        Pong.context.fillRect(
            Pong.canvas.width / 2 - 350,
            Pong.canvas.height / 2 - 48,
            700,
            100
        );

        Pong.context.fillStyle = '#ffffff';
        Pong.context.fillText(text, Pong.canvas.width / 2, Pong.canvas.height / 2 + 15);
    },

    menu: function () {
        Pong.draw();

        this.context.font = '50px Courier New';
        this.context.fillStyle = this.color;

        this.context.fillRect(
            this.canvas.width / 2 - 350,
            this.canvas.height / 2 - 48,
            700,
            100
        );

        this.context.fillStyle = '#ffffff';
        this.context.fillText('Press any key to begin\n within 10 seconds', this.canvas.width / 2, this.canvas.height / 2 + 15);
    },

    update: function () {
        if (!this.over) {
            this.handleBallBoundaries();
            this.handlePaddleMovement(this.playerLeft);
            this.handlePaddleMovement(this.playerLeft2);  // Handle movement for additional left paddle
            this.handlePaddleMovement(this.playerRight);
            this.handlePaddleMovement(this.playerRight2); // Handle movement for additional right paddle

            if (Pong._turnDelayIsOver.call(this) && this.turn) {
                this.ball.moveX = this.turn === this.playerLeft || this.turn === this.playerLeft2 ? DIRECTION.LEFT : DIRECTION.RIGHT;
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
        if (this.ball.x <= 0) Pong._resetTurn.call(this, this.playerRight, this.playerLeft);
        if (this.ball.x >= this.canvas.width - this.ball.width) Pong._resetTurn.call(this, this.playerLeft, this.playerRight);
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
        this.handlePaddleBallCollision(this.playerLeft2, DIRECTION.RIGHT);  // Collision handling for additional left paddle
        this.handlePaddleBallCollision(this.playerRight, DIRECTION.LEFT);
        this.handlePaddleBallCollision(this.playerRight2, DIRECTION.LEFT); // Collision handling for additional right paddle
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
                setTimeout(function () { Pong.endGameMenu('Left Player Wins!'); }, 1000);
            } else {
                this.advanceToNextRound();
            }
        } else if (this.playerRight.score === this.rounds[this.round]) {
            if (!this.rounds[this.round + 1]) {
                this.over = true;
                setTimeout(function () { Pong.endGameMenu('Right Player Wins!'); }, 1000);
            } else {
                this.advanceToNextRound();
            }
        }
    },

    advanceToNextRound: function() {
        this.playerLeft.score = this.playerRight.score = 0;
        this.round += 1;
        this.ball = Ball.new.call(this); // Reset the ball for the new round
        this.turn = this.playerRight; // Ensure the turn is reset properly
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
        this.drawPaddle(this.playerLeft2);  // Draw additional left paddle
        this.drawPaddle(this.playerRight);
        this.drawPaddle(this.playerRight2); // Draw additional right paddle
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
        this.context.fillText('Round ' + (Pong.round + 1), (this.canvas.width / 2), 35);

        // Draw the current round score
        this.context.font = '40px Courier';
        this.context.fillText(this.rounds[Pong.round] ? this.rounds[Pong.round] : this.rounds[Pong.round - 1], (this.canvas.width / 2), 100);
    },

    drawPaddle: function(paddle) {
        this.context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    },

    drawBall: function() {
        this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
    },

    drawNet: function() {
        for (let i = 20; i < this.canvas.height; i += 30) {
            this.context.fillStyle = '#ffffff';
            this.context.fillRect((this.canvas.width / 2) - 1, i, 2, 20);
        }
    },

    listen: function () {
        document.addEventListener('keydown', function (key) {
            if (Pong.running === false) {
                Pong.running = true;
                window.requestAnimationFrame(Pong.loop);
                return;
            }
            key.preventDefault();

            // Left player paddles
            if (key.key === 'w') Pong.playerLeft.move = DIRECTION.UP;
            if (key.key === 'q') Pong.playerLeft2.move = DIRECTION.UP;
            if (key.key === 's') Pong.playerLeft.move = DIRECTION.DOWN;
            if (key.key === 'a') Pong.playerLeft2.move = DIRECTION.DOWN;

            // Right player paddles
            if (key.key === 'i') Pong.playerRight.move = DIRECTION.UP;
            if (key.key === 'o') Pong.playerRight2.move = DIRECTION.UP;
            if (key.key === 'k') Pong.playerRight.move = DIRECTION.DOWN;
            if (key.key === 'l') Pong.playerRight2.move = DIRECTION.DOWN;
        });

        document.addEventListener('keyup', function (key) {
            // Left player paddles
            if (key.key === 'w' || key.key === 's') Pong.playerLeft.move = DIRECTION.IDLE;
            if (key.key === 'q' || key.key === 'a') Pong.playerLeft2.move = DIRECTION.IDLE;

            // Right player paddles
            if (key.key === 'i' || key.key === 'k') Pong.playerRight.move = DIRECTION.IDLE;
            if (key.key === 'o' || key.key === 'l') Pong.playerRight2.move = DIRECTION.IDLE;
        });
    },

    loop: function () {
        Pong.update();
        Pong.draw();

        if (!Pong.over) requestAnimationFrame(Pong.loop);
    },

    _resetTurn: function (victor, loser) {
        this.ball = Ball.new.call(this);
        this.turn = loser;
        this.timer = (new Date()).getTime();
        victor.score++;
        
        if (victor.score === this.rounds[this.round]) {
            if (!this.rounds[this.round + 1]) {
                this.over = true;
                let winnerName = victor === this.playerLeft || victor === this.playerLeft2 ? this.playerLeft.name : this.playerRight.name;
                setTimeout(function () {
                    Pong.endGameMenu(winnerName + ' Wins!');
                    recordMatchWinner(winnerName);
                }, 10000);
            } else {
                this.advanceToNextRound();
            }
        }
    },

    _turnDelayIsOver: function () {
        return ((new Date()).getTime() - this.timer >= 1000);
    }
};

var Pong = Object.assign({}, Game);

// Utility function to set the current game
function setCurrentGame(game) {
    window.currentGame = game;
}

// Utility function to record match winner
function recordMatchWinner(winnerName) {
    console.log(`${winnerName} wins the match!`);
}

// Initialize the game
Pong.initialize('Player 1', 'Player 2', [5, 5, 5]);
