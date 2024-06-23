
var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

var players = [];
var tournamentBracket = [];
var currentMatch = 0;
var matchResults = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBracket(players) {
    let bracket = [];
    for (let i = 0; i < players.length; i += 2) {
        bracket.push([players[i + 1], players[i]]);
    }
    return bracket;
}

function updateUI(message, type) {
    let element = null;
    if (type === 'champion') {
        element = document.getElementById('champion');
    } else if (type === 'current_game') {
        element = document.getElementById('current-game');
    }
    if (element) {
        element.innerText = message;
    }
}

function startNextMatch() {
    if (currentMatch < tournamentBracket.length) {
        let match = tournamentBracket[currentMatch];
        Pong.finalize();
        updateUI(" " + match[0] + " vs " + match[1], 'current_game');
        Pong.initialize(match[0], match[1]);
    } else {
        if (tournamentBracket.length > 1) {
            advanceTournament();
        } else {
            updateUI("Winner: " + tournamentBracket[0][0], 'champion');
        }
    }
}

function advanceTournament() {
    let winners = [];
    for (let i = 0; i < matchResults.length; i++) {
        winners.push(matchResults[i]);
    }
    tournamentBracket = createBracket(winners);
    currentMatch = 0;
    matchResults = [];
    startNextMatch();
}

function recordMatchWinner(winner) {
    matchResults.push(winner);
    currentMatch++;
    startNextMatch();
}

var rounds = [3];

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

var Paddle = {
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

var GameTour = {
    initialize: function (playerLeftName, playerRightName) {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');

        this.updateCanvasSize();
    
        this.playerLeft = Paddle.new.call(this, 'left');
        this.playerRight = Paddle.new.call(this, 'right');
        this.ball = Ball.new.call(this);
    
        this.playerRight.speed = 8;
        this.playerLeft.speed = 8;
        this.running = this.over = false;
        this.turn = this.playerRight;
        this.timer = this.round = 0;
        this.color = '#212529';
    
        this.playerLeft.name = playerLeftName;
        this.playerRight.name = playerRightName;

        window.addEventListener('resize', this.updateCanvasSize.bind(this));

        Pong.menu();
        Pong.listen();
    },

    updateCanvasSize: function () {
        const div = document.querySelector('.responsive-div');
        if (div && div.clientWidth && div.clientHeight) {
            this.canvas.width = div.clientWidth * 2;
            this.canvas.height = div.clientHeight * 2;
        }
    },
    
    finalize: function() {
        this.running = false;
        this.over = true;
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

    restartTournament: function() {
        this.finalize();
        initializeTournament();
    },
    
    endGameMenu: function (text) {
        if (!this.canvas || !this.context) return;
        const rectWidth = this.canvas.width * 0.35;
        const rectHeight = this.canvas.height * 0.1;
        const rectX = (this.canvas.width / 2) - (rectWidth / 2);
        const rectY = (this.canvas.height / 2) - (rectHeight / 2);
    
        this.context.font = `${Math.floor(this.canvas.height * 0.04)}px Courier New`;
        this.context.fillStyle = this.color;
        this.context.fillRect(rectX, rectY, rectWidth, rectHeight);
        this.context.fillStyle = '#ffffff';
        this.context.fillText(text, this.canvas.width / 2, this.canvas.height / 2 + rectHeight * 0.15);
    },
    

    menu: function () {
        this.draw();
    
        const rectWidth = this.canvas.width * 0.35;
        const rectHeight = this.canvas.height * 0.1;
        const rectX = (this.canvas.width / 2) - (rectWidth / 2);
        const rectY = (this.canvas.height / 2) - (rectHeight / 2);
    
        this.context.font = `${Math.floor(this.canvas.height * 0.05)}px Courier New`;
        this.context.fillStyle = this.color;
        this.context.fillRect(rectX, rectY, rectWidth, rectHeight);
        this.context.fillStyle = '#ffffff';
        this.context.fillText('Press any key to begin', this.canvas.width / 2, this.canvas.height / 2 + rectHeight * 0.15);
    },

    update: function () {
        if (!this.over) {
            this.handleBallBoundaries();
            this.handlePaddleMovement(this.playerLeft);
            this.handlePaddleMovement(this.playerRight);

            if (Pong._turnDelayIsOver.call(this) && this.turn) {
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
        if (this.playerLeft.score === rounds[this.round]) {
            if (!rounds[this.round + 1]) {
                this.over = true;
                setTimeout(function () { Pong.endGameMenu('Left Player Wins!'); }, 1000);
            } else {
                this.advanceToNextRound();
            }
        } else if (this.playerRight.score === rounds[this.round]) {
            if (!rounds[this.round + 1]) {
                this.over = true;
                setTimeout(function () { Pong.endGameMenu('Right Player Wins!'); }, 1000);
            } else {
                this.advanceToNextRound();
            }
        }
    },

    advanceToNextRound: function() {
        this.color = this.color;
        this.playerLeft.score = this.playerRight.score = 0;
        this.ball = Ball.new.call(this);
        this.round += 1;
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
        this.context.font = `${Math.floor(this.canvas.height * 0.1)}px Courier New`;
        this.context.textAlign = 'center';
        this.context.fillText(this.playerLeft.score.toString(), (this.canvas.width / 2) - this.canvas.width * 0.15, this.canvas.height * 0.18);
        this.context.fillText(this.playerRight.score.toString(), (this.canvas.width / 2) + this.canvas.width * 0.15, this.canvas.height * 0.18);
    
        this.context.font = `${Math.floor(this.canvas.height * 0.03)}px Courier New`;
        this.context.fillText('Round ' + (this.round + 1), (this.canvas.width / 2), this.canvas.height * 0.035);
    },
    

    drawPaddle: function(paddle) {
        const paddleWidth = this.canvas.width * 0.009;
        const paddleHeight = this.canvas.height * 0.164;
        this.context.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
    },
    

    drawBall: function() {
        const ballWidth = this.canvas.width * 0.0125;
        const ballHeight = this.canvas.height * 0.0227;
        this.context.fillRect(this.ball.x, this.ball.y, ballWidth, ballHeight);
    },
    
    drawNet: function() {
        this.context.beginPath();
        this.context.setLineDash([this.canvas.height * 0.007, this.canvas.height * 0.015]);
        this.context.moveTo(this.canvas.width / 2, this.canvas.height * 0.127);
        this.context.lineTo(this.canvas.width / 2, this.canvas.height * 0.873);
        this.context.lineWidth = this.canvas.width * 0.005;
        this.context.strokeStyle = '#ffffff';
        this.context.stroke();
    },

    loop: function () {
        if (Pong.over) return;
        if (!Pong.over) {
            Pong.update();
            Pong.draw();
            requestAnimationFrame(Pong.loop);
        }
    },

    listen: function () {
        document.addEventListener('keydown', function (key) {
            if (Pong.running === false) {
                Pong.running = true;
                window.requestAnimationFrame(Pong.loop);
            }
            key.preventDefault();

            if (key.key === 'w') Pong.playerLeft.move = DIRECTION.UP;
            if (key.key === 'o') Pong.playerRight.move = DIRECTION.UP;
            if (key.key === 's') Pong.playerLeft.move = DIRECTION.DOWN;
            if (key.key === 'l') Pong.playerRight.move = DIRECTION.DOWN;
        });

        document.addEventListener('keyup', function (key) {
            if (key.key === 'w' || key.key === 's') Pong.playerLeft.move = DIRECTION.IDLE;
            if (key.key === 'o' || key.key === 'l') Pong.playerRight.move = DIRECTION.IDLE;
        });
    },

    _resetTurn: function (victor, loser) {
        this.ball = Ball.new.call(this);
        this.turn = loser;
        this.timer = (new Date()).getTime();
        victor.score++;
    
        if (victor.score === rounds[this.round]) {
            if (!rounds[this.round + 1]) {
                this.over = true;
                let winnerName = victor === this.playerLeft ? this.playerLeft.name : this.playerRight.name;
                setTimeout(function () {
                    Pong.endGameMenu(winnerName + ' Wins!');
                    recordMatchWinner(winnerName);
                }, 1000);
            } else {
                this.advanceToNextRound();
            }
        }
    },
    
    _turnDelayIsOver: function () {
        return ((new Date()).getTime() - this.timer >= 1000);
    },
};

var Pong = Object.assign({}, GameTour);

export function initializeTournament() {
    players = [];
    for (let i = 0; i < 4; i++) {
        let playerName = prompt("Enter name for Player " + (i + 1));
        if (playerName) {
            players.push(playerName);
        } else {
            i--;
        }
    }
    shuffle(players);
    tournamentBracket = createBracket(players);
    currentMatch = 0;
    matchResults = [];
    startNextMatch();
}

document.addEventListener('DOMContentLoaded', (event) => {
    const restartButton = document.getElementById('restartButtonTournament');
    if (restartButton) {
        restartButton.addEventListener('click', () => {
            cancelAnimationFrame(this.loop);
            document.removeEventListener('keydown', this.keydownHandler);
            document.removeEventListener('keyup', this.keyupHandler);
        });
    }
});
window.GameTour = GameTour;