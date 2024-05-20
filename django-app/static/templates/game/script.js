// // Global Variables
// var DIRECTION = {
//     IDLE: 0,
//     UP: 1,
//     DOWN: 2,
//     LEFT: 3,
//     RIGHT: 4
// };
 
// var rounds = [5, 5, 3, 3, 2];
 
// // The ball object (The cube that bounces back and forth)
// var Ball = {
//     new: function () {
//         return {
//             width: 25,
//             height: 25,
//             x: (this.canvas.width / 2) - 9,
//             y: (this.canvas.height / 2) - 9,
//             moveX: DIRECTION.IDLE,
//             moveY: DIRECTION.IDLE,
//             speed: 7
//         };
//     }
// };
 
// // The playerRight object (The two lines that move up and down)
// var playerRight = {
//     new: function (side) {
//         return {
//             width: 18,
//             height: 180,
//             x: side === 'left' ? 150 : this.canvas.width - 150,
//             y: (this.canvas.height / 2) - 35,
//             score: 0,
//             move: DIRECTION.IDLE,
//             speed: 8
//         };
//     }
// };
 
// var Game = {
//     initialize: function () {
//         this.canvas = document.querySelector('canvas');
//         this.context = this.canvas.getContext('2d');
 
//         this.canvas.width = 2000;
//         this.canvas.height = 1100;
 
//         this.canvas.style.width = (this.canvas.width / 2) + 'px';
//         this.canvas.style.height = (this.canvas.height / 2) + 'px';
 
//         this.playerLeft = playerRight.new.call(this, 'left');
//         this.playerRight = playerRight.new.call(this, 'right');
//         this.ball = Ball.new.call(this);
 
//         this.playerRight.speed = 5;
//         this.running = this.over = false;
//         this.turn = this.playerRight;
//         this.timer = this.round = 0;
//         this.color = '#212529';
 
//         Pong.menu();
//         Pong.listen();
//     },
 
//     endGameMenu: function (text) {
//         // Change the canvas font size and color
//         Pong.context.font = '45px Courier New';
//         Pong.context.fillStyle = this.color;
 
//         // Draw the rectangle behind the 'Press any key to begin' text.
//         Pong.context.fillRect(
//             Pong.canvas.width / 2 - 350,
//             Pong.canvas.height / 2 - 48,
//             700,
//             100
//         );
//         // Draw the end game menu text ('Game Over' and 'Winner')
//         Pong.context.fillText(text,
//             Pong.canvas.width / 2,
//             Pong.canvas.height / 2 + 15
//         );
 
//         setTimeout(function () {
//             Pong = Object.assign({}, Game);
//             Pong.initialize();
//         }, 3000);
//     },
 
//     menu: function () {
//         // Draw all the Pong objects in their current state
//         Pong.draw();
 
//         // Change the canvas font size and color
//         this.context.font = '50px Courier New';
//         this.context.fillStyle = this.color;
 
//         // Draw the rectangle behind the 'Press any key to begin' text.
//         this.context.fillRect(
//             this.canvas.width / 2 - 350,
//             this.canvas.height / 2 - 48,
//             700,
//             100
//         );
 
//         // Change the canvas color;
//         this.context.fillStyle = '#ffffff';
 
//         // Draw the 'press any key to begin' text
//         this.context.fillText('Press any key to begin',
//             this.canvas.width / 2,
//             this.canvas.height / 2 + 15
//         );
//     },
 
//     // Update all objects (move the playerLeft, playerRight, ball, increment the score, etc.)
//     update: function () {
//         if (!this.over) {
//             // If the ball collides with the bound limits - correct the x and y coords.
//             if (this.ball.x <= 0) Pong._resetTurn.call(this, this.playerRight, this.playerLeft);
//             if (this.ball.x >= this.canvas.width - this.ball.width) Pong._resetTurn.call(this, this.playerLeft, this.playerRight);
//             if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
//             if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;
 
//             // Move playerLeft if they playerLeft.move value was updated by a keyboard event
//             if (this.playerLeft.move === DIRECTION.UP) this.playerLeft.y -= this.playerLeft.speed;
//             else if (this.playerLeft.move === DIRECTION.DOWN) this.playerLeft.y += this.playerLeft.speed;
 
//             // On new serve (start of each turn) move the ball to the correct side
//             // and randomize the direction to add some challenge.
//             if (Pong._turnDelayIsOver.call(this) && this.turn) {
//                 this.ball.moveX = this.turn === this.playerLeft ? DIRECTION.LEFT : DIRECTION.RIGHT;
//                 this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
//                 this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
//                 this.turn = null;
//             }
 
//             // If the playerLeft collides with the bound limits, update the x and y coords.
//             if (this.playerLeft.y <= 0) this.playerLeft.y = 0;
//             else if (this.playerLeft.y >= (this.canvas.height - this.playerLeft.height)) this.playerLeft.y = (this.canvas.height - this.playerLeft.height);
 
//             // Move ball in intended direction based on moveY and moveX values
//             if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
//             else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
//             if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
//             else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;
            

//             if (this.playerRight.move === DIRECTION.UP) this.playerRight.y -= this.playerRight.speed;
//             else if (this.playerRight.move === DIRECTION.DOWN) this.playerRight.y += this.playerRight.speed;

//             if (this.playerRight.y <= 0) this.playerRight.y = 0;
//             else if (this.playerRight.y >= (this.canvas.height - this.playerRight.height)) this.playerRight.y = (this.canvas.height - this.playerRight.height);

//             // // Handle playerRight (playerRight) UP and DOWN movement
//             // if (this.playerRight.y > this.ball.y - (this.playerRight.height / 2)) {
//             //     if (this.ball.moveX === DIRECTION.RIGHT) this.playerRight.y -= this.playerRight.speed / 1.5;
//             //     else this.playerRight.y -= this.playerRight.speed / 4;
//             // }
//             // if (this.playerRight.y < this.ball.y - (this.playerRight.height / 2)) {
//             //     if (this.ball.moveX === DIRECTION.RIGHT) this.playerRight.y += this.playerRight.speed / 1.5;
//             //     else this.playerRight.y += this.playerRight.speed / 4;
//             // }
 
//             // Handle playerRight (playerRight) wall collision

 
//             // Handle PlayerLeft-Ball collisions
//             if (this.ball.x - this.ball.width <= this.playerLeft.x && this.ball.x >= this.playerLeft.x - this.playerLeft.width) {
//                 if (this.ball.y <= this.playerLeft.y + this.playerLeft.height && this.ball.y + this.ball.height >= this.playerLeft.y) {
//                     this.ball.x = (this.playerLeft.x + this.ball.width);
//                     this.ball.moveX = DIRECTION.RIGHT;
 
//                 }
//             }
 
//             // Handle playerRight-ball collision
//             if (this.ball.x - this.ball.width <= this.playerRight.x && this.ball.x >= this.playerRight.x - this.playerRight.width) {
//                 if (this.ball.y <= this.playerRight.y + this.playerRight.height && this.ball.y + this.ball.height >= this.playerRight.y) {
//                     this.ball.x = (this.playerRight.x - this.ball.width);
//                     this.ball.moveX = DIRECTION.LEFT;
 
//                 }
//             }
//         }
//         // Handle the end of round transition
//         // Check to see if the playerLeft won the round.
//         if (this.playerLeft.score === rounds[this.round]) {
//             // Check to see if there are any more rounds/levels left and display the victory screen if
//             // there are not.
//             if (!rounds[this.round + 1]) {
//                 this.over = true;
//                 setTimeout(function () { Pong.endGameMenu('Winner!'); }, 1000);
//             } else {
//                 // If there is another round, reset all the values and increment the round number.
//                 this.color = this.color;
//                 this.playerLeft.score = this.playerRight.score = 0;
//                 this.playerLeft.speed += 0.5;
//                 this.playerRight.speed += 1;
//                 this.ball.speed += 1;
//                 this.round += 1;
 
//             }
//         }
//         // Check to see if the playerRight/playerRight has won the round.
//         else if (this.playerRight.score === rounds[this.round]) {
//             this.over = true;
//             setTimeout(function () { Pong.endGameMenu('Game Over!'); }, 1000);
//         }
//     },
 
//     // Draw the objects to the canvas element
//     draw: function () {
//         // Clear the Canvas
//         this.context.clearRect(
//             0,
//             0,
//             this.canvas.width,
//             this.canvas.height
//         );
 
//         // Set the fill style to black
//         this.context.fillStyle = this.color;
 
//         // Draw the background
//         this.context.fillRect(
//             0,
//             0,
//             this.canvas.width,
//             this.canvas.height
//         );
 
//         // Set the fill style to white (For the paddles and the ball)
//         this.context.fillStyle = '#ffffff';
 
//         // Draw the PlayerLeft
//         this.context.fillRect(
//             this.playerLeft.x,
//             this.playerLeft.y,
//             this.playerLeft.width,
//             this.playerLeft.height
//         );
 
//         // Draw the playerRight
//         this.context.fillRect(
//             this.playerRight.x,
//             this.playerRight.y,
//             this.playerRight.width,
//             this.playerRight.height 
//         );
 
//         // Draw the Ball
//         if (Pong._turnDelayIsOver.call(this)) {
//             this.context.fillRect(
//                 this.ball.x,
//                 this.ball.y,
//                 this.ball.width,
//                 this.ball.height
//             );
//         }
 
//         // Draw the net (Line in the middle)
//         this.context.beginPath();
//         this.context.setLineDash([7, 15]);
//         this.context.moveTo((this.canvas.width / 2), this.canvas.height - 140);
//         this.context.lineTo((this.canvas.width / 2), 140);
//         this.context.lineWidth = 10;
//         this.context.strokeStyle = '#ffffff';
//         this.context.stroke();
 
//         // Set the default canvas font and align it to the center
//         this.context.font = '100px Courier New';
//         this.context.textAlign = 'center';
 
//         // Draw the playerLefts score (left)
//         this.context.fillText(
//             this.playerLeft.score.toString(),
//             (this.canvas.width / 2) - 300,
//             200
//         );
 
//         // Draw the paddles score (right)
//         this.context.fillText(
//             this.playerRight.score.toString(),
//             (this.canvas.width / 2) + 300,
//             200
//         );
 
//         // Change the font size for the center score text
//         this.context.font = '30px Courier New';
 
//         // Draw the winning score (center)
//         this.context.fillText(
//             'Round ' + (Pong.round + 1),
//             (this.canvas.width / 2),
//             35
//         );
 
//         // Change the font size for the center score value
//         this.context.font = '40px Courier';
 
//         // Draw the current round number
//         this.context.fillText(
//             rounds[Pong.round] ? rounds[Pong.round] : rounds[Pong.round - 1],
//             (this.canvas.width / 2),
//             100
//         );
//     },
 
//     loop: function () {
//         Pong.update();
//         Pong.draw();
 
//         // If the game is not over, draw the next frame.
//         if (!Pong.over) requestAnimationFrame(Pong.loop);
//     },
 
//     listen: function () {
//         document.addEventListener('keydown', function (key) {
// 			// Handle the 'Press any key to begin' function and start the game.
//             if (Pong.running === false) {
// 				Pong.running = true;
//                 window.requestAnimationFrame(Pong.loop);
// 				return ; 
//             }
// 			key.preventDefault();

//             // Handle o == 79 and w == 87 key events
//             if (key.key === 'w') Pong.playerLeft.move = DIRECTION.UP;
//             if (key.key === 'o') Pong.playerRight.move = DIRECTION.UP;
//             // Handle k == 75 and s == 83 key events
//             if (key.key === 's') Pong.playerLeft.move = DIRECTION.DOWN;
//             if (key.key === 'k') Pong.playerRight.move = DIRECTION.DOWN;
//         });
 
//         // Stop the playerLeft from moving when there are no keys being pressed.
//         document.addEventListener('keyup', function (key) { 
// 			Pong.playerLeft.move = DIRECTION.IDLE;
// 			Pong.playerRight.move = DIRECTION.IDLE;
// 		});
//     },
 
//     // Reset the ball location, the playerLeft turns and set a delay before the next round begins.
//     _resetTurn: function(victor, loser) {
//         this.ball = Ball.new.call(this, this.ball.speed);
//         this.turn = loser;
//         this.timer = (new Date()).getTime();
 
//         victor.score++;
//     },
 
//     // WplayerRightt for a delay to have passed after each turn.
//     _turnDelayIsOver: function() {
//         return ((new Date()).getTime() - this.timer >= 1000);
//     },
// };
 
// var Pong = Object.assign({}, Game);
// Pong.initialize();

console.log("try to fetch " + 'ws://' + window.location.host + '/ws/game/')
// const socket = new WebSocket('ws://' + window.location.host + '/ws/game/');

socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    if (data.event === 'connected') {
        console.log(data.message);
    } else if (data.event === 'end') {
        // Gestisci la fine del gioco
        alert(data.message);
    } else {
        // Aggiorna il gioco con i dati ricevuti
        updateGame(data);
    }
};

socket.onopen = function(e) {
    console.log('WebSocket connection established.');
};

socket.onclose = function(e) {
    console.log('WebSocket connection closed.');
};

function updateGame(data) {
    // Aggiorna gli oggetti di gioco con i dati ricevuti
    playerLeft.x = data.playerLeft.x;
    playerLeft.y = data.playerLeft.y;
    playerLeft.score = data.playerLeft.score;

    playerRight.x = data.playerRight.x;
    playerRight.y = data.playerRight.y;
    playerRight.score = data.playerRight.score;

    ball.x = data.ball.x;
    ball.y = data.ball.y;
}

// Invia i comandi di movimento al server
window.addEventListener('keydown', function(e) {
    if (e.key === 'w') {
        socket.send(JSON.stringify({'event': 'move', 'side': 'left', 'direction': 'UP'}));
    }
    if (e.key === 's') {
        socket.send(JSON.stringify({'event': 'move', 'side': 'left', 'direction': 'DOWN'}));
    }
    if (e.key === 'o') {
        socket.send(JSON.stringify({'event': 'move', 'side': 'right', 'direction': 'UP'}));
    }
    if (e.key === 'k') {
        socket.send(JSON.stringify({'event': 'move', 'side': 'right', 'direction': 'DOWN'}));
    }
});

// Ferma il movimento quando i tasti vengono rilasciati
window.addEventListener('keyup', function(e) {
    if (['w', 's'].includes(e.key)) {
        socket.send(JSON.stringify({'event': 'move', 'side': 'left', 'direction': 'IDLE'}));
    }
    if (['o', 'k'].includes(e.key)) {
        socket.send(JSON.stringify({'event': 'move', 'side': 'right', 'direction': 'IDLE'}));
    }
});
