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

// The paddle object (The two lines that move up and down)
var Paddle = {
    new: function (side, position) {
        return {
            width: this.canvas.width * 0.009,
            height: this.canvas.height * 0.15,
            x: side === 'left' ? this.canvas.width * 0.075 + (position * this.canvas.width * 0.03) : this.canvas.width - this.canvas.width * 0.075 - (position * this.canvas.width * 0.03),
            y: (this.canvas.height / 2) - (this.canvas.height * 0.15 / 2),
            score: 0,
            move: DIRECTION.IDLE,
            speed: this.canvas.height * 0.007
        };
    }
};

var GameMulti = {
    initialize: function (playerLeftName, playerRightName, rounds) {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');

        this.updateCanvasSize();


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

        window.addEventListener('resize', this.updateCanvasSize.bind(this));

        Pong.menu();
        Pong.listen();
    },

    updateCanvasSize: function () {
        const div = document.querySelector('.responsive-div');
        this.canvas.width = div.clientWidth * 2;
        this.canvas.height = div.clientHeight * 2;
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

    restartMulti: function(playerLeftName, playerRightName, rounds) {
        this.finalize();
        Pong.initialize('Player 1', 'Player 2', [5, 5, 5]);
    },

    endGameMenu: function (text) {
        const rectWidth = this.canvas.width * 0.35; // 35% of canvas width
        const rectHeight = this.canvas.height * 0.1; // 10% of canvas height
        const rectX = (this.canvas.width / 2) - (rectWidth / 2); // Centered horizontally
        const rectY = (this.canvas.height / 2) - (rectHeight / 2); // Centered vertically
    
        Pong.context.font = `${Math.floor(this.canvas.height * 0.04)}px Courier New`; // 4% of canvas height
        Pong.context.fillStyle = this.color;
        Pong.context.fillRect(rectX, rectY, rectWidth, rectHeight);
        Pong.context.fillStyle = '#ffffff';
        Pong.context.fillText(text, this.canvas.width / 2, this.canvas.height / 2 + rectHeight * 0.15);
    },

    menu: function () {
        Pong.draw();

        const rectWidth = this.canvas.width * 0.35; // 35% of canvas width
        const rectHeight = this.canvas.height * 0.1; // 10% of canvas height
        const rectX = (this.canvas.width / 2) - (rectWidth / 2); // Centered horizontally
        const rectY = (this.canvas.height / 2) - (rectHeight / 2); // Centered vertically
    
        this.context.font = `${Math.floor(this.canvas.height * 0.05)}px Courier New`; // 5% of canvas height
        this.context.fillStyle = this.color;
        this.context.fillRect(rectX, rectY, rectWidth, rectHeight);
        this.context.fillStyle = '#ffffff';
        this.context.fillText('Press any key to begin', this.canvas.width / 2, this.canvas.height / 2 + rectHeight * 0.15);
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
                setTimeout(function () { Pong.endGameMenu('Left Players Win!'); }, 1000);
            } else {
                this.advanceToNextRound();
            }
        } else if (this.playerRight.score === this.rounds[this.round]) {
            if (!this.rounds[this.round + 1]) {
                this.over = true;
                setTimeout(function () { Pong.endGameMenu('Right Players Win!'); }, 1000);
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
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = '#ffffff';
        this.drawPaddle(this.playerLeft);
        this.drawPaddle(this.playerLeft2);  // Draw additional left paddle
        this.drawPaddle(this.playerRight);
        this.drawPaddle(this.playerRight2); // Draw additional right paddle
        this.drawBall();
        this.drawNet();
        this.context.font = `${Math.floor(this.canvas.height * 0.1)}px Courier New`; // 10% of canvas height
        this.context.textAlign = 'center';
        this.context.fillText(this.playerLeft.score.toString(), (this.canvas.width / 2) - this.canvas.width * 0.15, this.canvas.height * 0.18); // 18% of canvas height
        this.context.fillText(this.playerRight.score.toString(), (this.canvas.width / 2) + this.canvas.width * 0.15, this.canvas.height * 0.18);
    
        // Draw round number
        this.context.font = `${Math.floor(this.canvas.height * 0.03)}px Courier New`; // 3% of canvas height
        this.context.fillText('Round ' + (this.round + 1), (this.canvas.width / 2), this.canvas.height * 0.035); // 3.5% of canvas height
    
        // Draw current round score
        this.context.font = `${Math.floor(this.canvas.height * 0.04)}px Courier`; // 4% of canvas height
        this.context.fillText(this.rounds[this.round] ? this.rounds[this.round] : this.rounds[this.round - 1], (this.canvas.width / 2), this.canvas.height * 0.1); // 10% of canvas height
    },
    

    drawPaddle: function(paddle) {
        const paddleWidth = this.canvas.width * 0.009; // 0.9% of canvas width
        const paddleHeight = this.canvas.height * 0.164; // 16.4% of canvas height
        this.context.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
    },
    

    drawBall: function() {
        const ballWidth = this.canvas.width * 0.0125; // 1.25% of canvas width
        const ballHeight = this.canvas.height * 0.0227; // 2.27% of canvas height
        this.context.fillRect(this.ball.x, this.ball.y, ballWidth, ballHeight);
    },
    
    drawNet: function() {
        this.context.beginPath();
        this.context.setLineDash([this.canvas.height * 0.007, this.canvas.height * 0.015]); // Set line dash to percentage of canvas height
        this.context.moveTo(this.canvas.width / 2, this.canvas.height * 0.127); // 12.7% of canvas height
        this.context.lineTo(this.canvas.width / 2, this.canvas.height * 0.873); // 87.3% of canvas height
        this.context.lineWidth = this.canvas.width * 0.005; // 0.5% of canvas width
        this.context.strokeStyle = '#ffffff';
        this.context.stroke();
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
            if (key.key === 'q') Pong.playerLeft.move = DIRECTION.UP;
            if (key.key === 'w') Pong.playerLeft2.move = DIRECTION.UP;
            if (key.key === 'a') Pong.playerLeft.move = DIRECTION.DOWN;
            if (key.key === 's') Pong.playerLeft2.move = DIRECTION.DOWN;

            // Right player paddles
            if (key.key === 'o') Pong.playerRight.move = DIRECTION.UP;
            if (key.key === 'i') Pong.playerRight2.move = DIRECTION.UP;
            if (key.key === 'l') Pong.playerRight.move = DIRECTION.DOWN;
            if (key.key === 'k') Pong.playerRight2.move = DIRECTION.DOWN;
        });

        document.addEventListener('keyup', function (key) {
            // Left player paddles
            if (key.key === 'q' || key.key === 'a') Pong.playerLeft.move = DIRECTION.IDLE;
            if (key.key === 'w' || key.key === 's') Pong.playerLeft2.move = DIRECTION.IDLE;

            // Right player paddles
            if (key.key === 'o' || key.key === 'l') Pong.playerRight.move = DIRECTION.IDLE;
            if (key.key === 'i' || key.key === 'k') Pong.playerRight2.move = DIRECTION.IDLE;
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

var Pong = Object.assign({}, GameMulti);

document.addEventListener('DOMContentLoaded', (event) => {
    const restartButton = document.getElementById('restartButtonMulti');
    if (restartButton) {
        restartButton.addEventListener('click', () => {

            document.removeEventListener('keydown', this.keydownHandler);
            document.removeEventListener('keyup', this.keyupHandler);

            Pong.initialize('Player 1', 'Player 2', [5]);
        });
    }
});
window.GameMulti = GameMulti;