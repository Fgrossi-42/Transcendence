

const DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

const Ball = {
    new: function () {
        return {
            width: this.canvas.width * 0.0125,
            height: this.canvas.width * 0.0125,
            x: (this.canvas.width / 2) - (this.canvas.width * 0.0125 / 2),
            y: (this.canvas.height / 2) - (this.canvas.width * 0.0125 / 2),
            moveX: DIRECTION.IDLE,
            moveY: DIRECTION.IDLE,
            speed: this.canvas.width * 0.004
        };
    }
};

const Paddle = {
    new: function (side) {
        return {
            width: this.canvas.width * 0.009,
            height: this.canvas.height * 0.15,
            x: side === 'left' ? this.canvas.width * 0.075 : this.canvas.width - this.canvas.width * 0.075,
            y: (this.canvas.height / 2) - (this.canvas.height * 0.15 / 2),
            score: 0,
            move: DIRECTION.IDLE,
            speed: this.canvas.height * 0.007
        };
    }
};

const Game = {
    initialize: function (playerLeftName, playerRightName, rounds) {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');

        this.updateCanvasSize();

        this.playerLeft = Paddle.new.call(this, 'left');
        this.playerRight = Paddle.new.call(this, 'right');
        this.ball = Ball.new.call(this);

        this.running = this.over = false;
        this.turn = this.playerRight;
        this.timer = this.round = 0;
        this.color = '#212529';

        this.playerLeft.name = playerLeftName;
        this.playerRight.name = playerRightName;
        this.rounds = rounds;

        window.addEventListener('resize', this.updateCanvasSize.bind(this));

        this.menu();
        this.listen();
    },

    updateCanvasSize: function () {
        const div = document.querySelector('.responsive-div');
        this.canvas.width = div.clientWidth * 2;
        this.canvas.height = div.clientHeight * 2;
    },

    finalize: function() {
        this.running = false; 
        this.turn = null;
        this.timer = this.round = 0;
        this.playerLeft = this.playerRight = this.ball = this.canvas = this.context = null;
        this.color = '#212529';
        this.rounds = null;
    
        if (this.canvas) {
            this.canvas.style.width = '';
            this.canvas.style.height = '';
        }
    
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);
    },

    restart: function(playerLeftName, playerRightName, rounds) {
        this.finalize();
        this.initialize(playerLeftName, playerRightName, rounds);
    },

    endGameMenu: function (text) {
        this.context.font = '45px Courier New';
        this.context.fillStyle = this.color;
        this.context.fillRect(this.canvas.width / 2 - 350, this.canvas.height / 2 - 48, 700, 100);
        this.context.fillStyle = '#ffffff';
        this.context.fillText(text, this.canvas.width / 2, this.canvas.height / 2 + 15);
    },

    menu: function () {
        this.draw();
        this.context.font = '50px Courier New';
        this.context.fillStyle = this.color;
        this.context.fillRect(this.canvas.width / 2 - 350, this.canvas.height / 2 - 48, 700, 100);
        this.context.fillStyle = '#ffffff';
        this.context.fillText('Press any key to begin\n within 10 seconds', this.canvas.width / 2, this.canvas.height / 2 + 15);
    },

    update: function () {
        if (!this.over) {
            this.handleBallBoundaries();
            this.handlePaddleMovement(this.playerLeft);
            this.handlePaddleMovement(this.playerRight);

            if (this._turnDelayIsOver() && this.turn) {
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
        if (this.ball.x <= 0) this._resetTurn(this.playerRight, this.playerLeft);
        if (this.ball.x >= this.canvas.width - this.ball.width) this._resetTurn(this.playerLeft, this.playerRight);
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
                setTimeout(() => this.endGameMenu('Left Player Wins!'), 1000);
            } else {
                this.advanceToNextRound();
            }
        } else if (this.playerRight.score === this.rounds[this.round]) {
            if (!this.rounds[this.round + 1]) {
                this.over = true;
                setTimeout(() => this.endGameMenu('Right Player Wins!'), 1000);
            } else {
                this.advanceToNextRound();
            }
        }
    },

    advanceToNextRound: function() {
        this.playerLeft.score = this.playerRight.score = 0;
        this.round += 1;
        this.ball = Ball.new.call(this); 
        this.turn = this.playerRight; 
        },

    draw: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = '#ffffff';
        this.drawPaddle(this.playerLeft);
        this.drawPaddle(this.playerRight);
        this.drawBall();
        this.drawNet();
        this.context.font = '100px Courier New';
        this.context.textAlign = 'center';
        this.context.fillText(this.playerLeft.score.toString(), (this.canvas.width / 2) - this.canvas.width * 0.15, 200);
        this.context.fillText(this.playerRight.score.toString(), (this.canvas.width / 2) + this.canvas.width * 0.15, 200);
        this.context.font = '30px Courier New';
        this.context.fillText('Round ' + (this.round + 1), (this.canvas.width / 2), 35);
        this.context.font = '40px Courier';
        this.context.fillText(this.rounds[this.round] ? this.rounds[this.round] : this.rounds[this.round - 1], (this.canvas.width / 2), 100);
    },

    drawPaddle: function(paddle) {
        this.context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    },

    drawBall: function() {
        this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
    },

    drawNet: function() {
        this.context.beginPath();
        this.context.setLineDash([7, 15]);
        this.context.moveTo((this.canvas.width / 2), 140);
        this.context.lineTo((this.canvas.width / 2), this.canvas.height - 140);
        this.context.lineWidth = 10;
        this.context.strokeStyle = '#ffffff';
        this.context.stroke();
    },

    loop: function () {
        if (this.running) {
            this.update();
            this.draw();
            requestAnimationFrame(this.loop.bind(this));
        }
    },

    listen: function () {
        this.keydownHandler = function (key) {
            if (!this.running) {
                this.running = true;
                requestAnimationFrame(this.loop.bind(this));
            }
            key.preventDefault();

            if (key.key === 'w') this.playerLeft.move = DIRECTION.UP;
            if (key.key === 'o') this.playerRight.move = DIRECTION.UP;
            if (key.key === 's') this.playerLeft.move = DIRECTION.DOWN;
            if (key.key === 'k') this.playerRight.move = DIRECTION.DOWN;
        }.bind(this);

        this.keyupHandler = function (key) {
            if (key.key === 'w' || key.key === 's') this.playerLeft.move = DIRECTION.IDLE;
            if (key.key === 'o' || key.key === 'k') this.playerRight.move = DIRECTION.IDLE;
        }.bind(this);

        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    },

    _resetTurn: function (victor, loser) {
        this.turn = loser;
        this.timer = (new Date()).getTime();
        victor.score++;

        if (victor.score === this.rounds[this.round]) {
            if (!this.rounds[this.round + 1]) {
                this.over = true;
                const winnerName = victor === this.playerLeft ? this.playerLeft.name : this.playerRight.name;
                setTimeout(() => this.endGameMenu(winnerName + ' Wins!'), 1000);
            } else {
                this.advanceToNextRound();
            }
        }
    },

    _turnDelayIsOver: function () {
        return ((new Date()).getTime() - this.timer >= 1000);
    }
};

const Pong = Object.assign({}, Game);

document.addEventListener('DOMContentLoaded', (event) => {
    const restartButton = document.getElementById('restartButton');
    if (restartButton) {
        restartButton.addEventListener('click', () => {
                        cancelAnimationFrame(this.loop);

            document.removeEventListener('keydown', this.keydownHandler);
            document.removeEventListener('keyup', this.keyupHandler);

            Pong.initialize('Player 1', 'Player 2', [5, 5, 5]);
        });
    }
});
window.Game = Game;

export { Pong };
