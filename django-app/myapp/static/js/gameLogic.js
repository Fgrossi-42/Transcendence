// gameLogic.js

// Define your translations and current language
const translations = {
    en: {
        gameTitle: "Game",
        playButton: "Play"
        // Add more translations as needed
    },
    es: {
        gameTitle: "Juego",
        playButton: "Jugar"
        // Add more translations as needed
    }
};

let currentLanguage = 'en'; // Default language

// Function to update UI elements with current language
function updateUI() {
    document.getElementById('game-title').innerText = translations[currentLanguage].gameTitle;
    document.getElementById('restartButton').innerText = translations[currentLanguage].playButton;
    // Add more elements as needed
}

// Function to change language
function changeLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'es' : 'en'; // Toggle between 'en' and 'es'
    // Save currentLanguage to localStorage or cookies if needed
    localStorage.setItem('currentLanguage', currentLanguage);
    updateUI(); // Update UI with new language
}

// Initialize language based on saved preference (if any)
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('currentLanguage');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
        currentLanguage = savedLanguage;
    }
    updateUI(); // Initial UI update
}

// DOMContentLoaded event listener to initialize language and setup dynamic content
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage(); // Initialize language on page load
    // Add any other initialization logic you need
});

// Export functions if needed for testing or modularity
export { changeLanguage };

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
        const rectWidth = this.canvas.width * 0.35; // 35% of canvas width
        const rectHeight = this.canvas.height * 0.1; // 10% of canvas height
        const rectX = (this.canvas.width / 2) - (rectWidth / 2); // Centered horizontally
        const rectY = (this.canvas.height / 2) - (rectHeight / 2); // Centered vertically
    
        this.context.font = `${Math.floor(this.canvas.height * 0.04)}px Courier New`; // 4% of canvas height
        this.context.fillStyle = this.color;
        this.context.fillRect(rectX, rectY, rectWidth, rectHeight);
        this.context.fillStyle = '#ffffff';
        this.context.fillText(text, this.canvas.width / 2, this.canvas.height / 2 + rectHeight * 0.15);
    },
    

    menu: function () {
        this.draw();
    
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
                setTimeout(function () { Pong.endGameMenu('Left Player Win!'); }, 1000);
            } else {
                this.advanceToNextRound();
            }
        } else if (this.playerRight.score === this.rounds[this.round]) {
            if (!this.rounds[this.round + 1]) {
                this.over = true;
                setTimeout(function () { Pong.endGameMenu('Right Player Win!'); }, 1000);
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
            if (key.key === 'l') this.playerRight.move = DIRECTION.DOWN;
        }.bind(this);

        this.keyupHandler = function (key) {
            if (key.key === 'w' || key.key === 's') this.playerLeft.move = DIRECTION.IDLE;
            if (key.key === 'o' || key.key === 'l') this.playerRight.move = DIRECTION.IDLE;
        }.bind(this);

        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    },

    _resetTurn: function (victor, loser) {
        this.turn = loser;
        this.ball = Ball.new.call(this);
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

            Pong.initialize('Player 1', 'Player 2', [5]);
        });
    }
});
window.Game = Game;

export { Pong };
