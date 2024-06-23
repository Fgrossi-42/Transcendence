var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

var rounds = [5];

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

var Ai = {
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

var GameAI = {
    initialize: function () {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');

        this.updateCanvasSize();

        this.player = Ai.new.call(this, 'left');
        this.ai = Ai.new.call(this, 'right');
        this.ball = Ball.new.call(this);

        this.ai.speed = this.canvas.height * 0.005;
        this.running = this.over = false;
        this.turn = this.ai;
        this.timer = this.round = 0;
        this.color = '#212529';

        window.addEventListener('resize', this.updateCanvasSize.bind(this));

        PongAI.menu();
        PongAI.listen();
    },
    
    updateCanvasSize: function () {
        const div = document.querySelector('.responsive-div');
        if (div.clientWidth && div.clientHeight) {
            this.canvas.width = div.clientWidth * 2;
            this.canvas.height = div.clientHeight * 2;

            if (this.player && this.ai && this.ball) {
                this.player.width = this.canvas.width * 0.009;
                this.player.height = this.canvas.height * 0.15;
                this.player.x = this.canvas.width * 0.075;
                this.player.y = (this.canvas.height / 2) - (this.player.height / 2);
                this.player.speed = this.canvas.height * 0.007;

                this.ai.width = this.canvas.width * 0.009;
                this.ai.height = this.canvas.height * 0.15;
                this.ai.x = this.canvas.width - this.canvas.width * 0.075;
                this.ai.y = (this.canvas.height / 2) - (this.ai.height / 2);
                this.ai.speed = this.canvas.height * 0.007;

                this.ball.width = this.canvas.width * 0.0125;
                this.ball.height = this.canvas.width * 0.0125;
                this.ball.x = (this.canvas.width / 2) - (this.ball.width / 2);
                this.ball.y = (this.canvas.height / 2) - (this.ball.height / 2);
                this.ball.speed = this.canvas.width * 0.004;
            }
        }
    },

    finalize: function() {
        this.running = false;
        this.over = true;
        this.turn = null;
        this.timer = this.round = 0;
        this.playerLeft = null;
        this.ball = null;
        this.canvas = null;
        this.context = null;
        this.color = '#212529';
    },

    restartAI: function() {
        this.finalize();
        initializeAI();
    },

    endGameMenu: function (text) {
        const rectWidth = this.canvas.width * 0.35; 
        const rectHeight = this.canvas.height * 0.1; 
        const rectX = (this.canvas.width / 2) - (rectWidth / 2); 
        const rectY = (this.canvas.height / 2) - (rectHeight / 2); 
    
        PongAI.context.font = `${Math.floor(this.canvas.height * 0.04)}px Courier New`; 
        PongAI.context.fillStyle = this.color;
        PongAI.context.fillRect(rectX, rectY, rectWidth, rectHeight);
        PongAI.context.fillStyle = '#ffffff';
        PongAI.context.fillText(text, this.canvas.width / 2, this.canvas.height / 2 + rectHeight * 0.15);
    },

    menu: function () {
        PongAI.draw();
    
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
            if (this.ball.x <= 0) PongAI._resetTurn.call(this, this.ai, this.player);
            if (this.ball.x >= this.canvas.width - this.ball.width) PongAI._resetTurn.call(this, this.player, this.ai);
            if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
            if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;

            if (this.player.move === DIRECTION.UP) this.player.y -= this.player.speed;
            else if (this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;

            if (PongAI._turnDelayIsOver.call(this) && this.turn) {
                this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
                this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
                this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
                this.turn = null;
            }

            if (this.player.y <= 0) this.player.y = 0;
            else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);

            if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
            else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
            if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
            else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

            if (this.ai.y > this.ball.y - (this.ai.height / 2)) {
                if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y -= this.ai.speed / 1.5;
                else this.ai.y -= this.ai.speed / 4;
            }
            if (this.ai.y < this.ball.y - (this.ai.height / 2)) {
                if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y += this.ai.speed / 1.5;
                else this.ai.y += this.ai.speed / 4;
            }

            if (this.ai.y >= this.canvas.height - this.ai.height) this.ai.y = this.canvas.height - this.ai.height;
            else if (this.ai.y <= 0) this.ai.y = 0;

            if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
                if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
                    this.ball.x = (this.player.x + this.ball.width);
                    this.ball.moveX = DIRECTION.RIGHT;
                }
            }

            if (this.ball.x - this.ball.width <= this.ai.x && this.ball.x >= this.ai.x - this.ai.width) {
                if (this.ball.y <= this.ai.y + this.ai.height && this.ball.y + this.ball.height >= this.ai.y) {
                    this.ball.x = (this.ai.x - this.ball.width);
                    this.ball.moveX = DIRECTION.LEFT;
                }
            }
        }

        if (this.player.score === rounds[this.round]) {
            if (!rounds[this.round + 1]) {
                this.over = true;
                setTimeout(function () { PongAI.endGameMenu('Winner!'); }, 1000);
            } else {
                this.player.score = this.ai.score = 0;
                this.round += 1;
            }
        }
        else if (this.ai.score === rounds[this.round]) {
            this.over = true;
            setTimeout(function () { PongAI.endGameMenu('Game Over!'); }, 1000);
        }
    },

    draw: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = '#ffffff';
        this.drawPaddle(this.player);
        this.drawPaddle(this.ai);
        this.drawBall();
        this.drawNet();
        this.context.font = `${Math.floor(this.canvas.height * 0.1)}px Courier New`; 
        this.context.textAlign = 'center';
        this.context.fillText(this.player.score.toString(), (this.canvas.width / 2) - this.canvas.width * 0.15, this.canvas.height * 0.18); 
        this.context.fillText(this.ai.score.toString(), (this.canvas.width / 2) + this.canvas.width * 0.15, this.canvas.height * 0.18);
    
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

    listen: function () {
        document.addEventListener('keydown', function (key) {
            if (PongAI.running === false) {
                PongAI.running = true;
                window.requestAnimationFrame(PongAI.loop);
            }

            if (key.keyCode === 38 || key.keyCode === 87) PongAI.player.move = DIRECTION.UP;

            if (key.keyCode === 40 || key.keyCode === 83) PongAI.player.move = DIRECTION.DOWN;
        });

        document.addEventListener('keyup', function (key) { PongAI.player.move = DIRECTION.IDLE; });
    },

    _resetTurn: function(victor, loser) {
        this.ball = Ball.new.call(this);
        this.turn = loser;
        this.timer = (new Date()).getTime();
        victor.score++;
    },

    _turnDelayIsOver: function() {
        return ((new Date()).getTime() - this.timer >= 1000);
    },

    loop: function () {
        if (!PongAI.over) {
            PongAI.update();
            PongAI.draw();
            requestAnimationFrame(PongAI.loop.bind(this));
        }
    }
};

var PongAI = Object.assign({}, GameAI);

export function initializeAI() {
    PongAI.initialize();
    return PongAI; 
}


document.addEventListener('DOMContentLoaded', (event) => {
    const restartButton = document.getElementById('restartButtonAI');
    if (restartButton) {
        restartButton.addEventListener('click', () => {
            cancelAnimationFrame(this.loop);

            document.removeEventListener('keydown', this.keydownHandler);
            document.removeEventListener('keyup', this.keyupHandler);
        });
    }
});
window.GameAI = GameAI;