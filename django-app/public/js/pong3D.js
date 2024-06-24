// Your existing code here...
(function (window, document, THREE) {
  var FIELD_WIDTH = 1300,
  FIELD_LENGTH = 2000,
  BALL_RADIUS = 20,
  PADDLE_WIDTH = 200,
  PADDLE_HEIGHT = 30,
  WINNING_SCORE = 5,
  player1Score = document.getElementById('player1Score'),
  player2Score = document.getElementById('player2Score'),
  champion = document.getElementById('winner'),
  container, renderer, camera, mainLight,
  scene, ball, paddle1, paddle2, field, running,
  score = {
    player1: 0,
    player2: 0
  },
  moveLeft = false,
  moveRight = false,
  movePaddle2Left = false,
  movePaddle2Right = false;

  function startBallMovement() {
    ball.position.set(0, 0, 0);
    var direction = Math.random() > 0.5 ? -1 : 1;
    ball.$velocity = {
      x: 0,
      z: direction * 15
    };
    ball.$stopped = false;
  }

  function processBallMovement() {
    if (!ball.$velocity) {
      startBallMovement();
    }
    if (ball.$stopped) {
      return;
    }
    updateBallPosition();
    if (isSideCollision()) {
      ball.$velocity.x *= -1;
    }
    if (isPaddle1Collision()) {
      hitBallBack(paddle1);
    }
    if (isPaddle2Collision()) {
      hitBallBack(paddle2);
    }
    if (isPastPaddle1()) {
      scoreBy('player2');
    }
    if (isPastPaddle2()) {
      scoreBy('player1');
    }
  }

  function isPastPaddle1() {
    return ball.position.z > paddle1.position.z + 100;
  }

  function isPastPaddle2() {
    return ball.position.z < paddle2.position.z - 100;
  }

  function updateBallPosition() {
    var ballPos = ball.position;
    ballPos.x += ball.$velocity.x;
    ballPos.z += ball.$velocity.z;
  }

  function isSideCollision() {
    var ballX = ball.position.x,
    halfFieldWidth = FIELD_WIDTH / 2;
    return ballX - BALL_RADIUS < -halfFieldWidth || ballX + BALL_RADIUS > halfFieldWidth;
  }

  function hitBallBack(paddle) {
    ball.$velocity.x = (ball.position.x - paddle.position.x) / 5;
    ball.$velocity.z *= -1;
  }

  function isPaddle2Collision() {
    return ball.position.z - BALL_RADIUS <= paddle2.position.z &&
    isBallAlignedWithPaddle(paddle2);
  }

  function isPaddle1Collision() {
    return ball.position.z + BALL_RADIUS >= paddle1.position.z &&
    isBallAlignedWithPaddle(paddle1);
  }

  function isBallAlignedWithPaddle(paddle) {
    var halfPaddleWidth = PADDLE_WIDTH / 2,
    paddleX = paddle.position.x,
    ballX = ball.position.x;
    return ballX > paddleX - halfPaddleWidth &&
    ballX < paddleX + halfPaddleWidth;
  }

  function scoreBy(playerName) {
    addPoint(playerName);
    updateScoreBoard();
    checkForWinner();
    if (!running) return;
    stopBall();
    setTimeout(startBallMovement, 2000);
  }

  function updateScoreBoard() {
    player1Score.textContent = ' ' + score.player1;
    player2Score.textContent = ' ' + score.player2;
  }

  function checkForWinner() {
    if (score.player1 >= WINNING_SCORE) {
      declareWinner('1');
    } else if (score.player2 >= WINNING_SCORE) {
      declareWinner('2');
    }
  }

  function declareWinner(winner) {
    stopRender();
    $('#declaration').show();
    console.log('Player ' + winner + ' wins!');
    champion.textContent = ' ' + winner;
  }

  function stopBall() {
    ball.$stopped = true;
  }

  function addPoint(playerName) {
    score[playerName]++;
  }

  function startRender() {
    running = true;
    render();
  }

  function stopRender() {
    running = false;
  }

  function render() {
    if (running) {
      requestAnimationFrame(render);
      processBallMovement();
      processPlayerMovement();
      processPlayer2Movement();
      renderer.render(scene, camera);
    }
  }

  function reset() {
    if (ball) {
      ball.position.set(0, 0, 0);
      ball.$velocity = null;
    }
    if (score) {
      score.player1 = 0;
      score.player2 = 0;
      updateScoreBoard();
    }
    moveLeft = false;
    moveRight = false;
    movePaddle2Left = false;
    movePaddle2Right = false;
    if (paddle1) {
      paddle1.position.x = 0;
    }
    if (paddle2) {
      paddle2.position.x = 0;
    }
  }

  function init() {
    container = document.getElementById('container');
    var WIDTH = container.clientWidth;
    var HEIGHT = container.clientHeight;
    var ASPECT = WIDTH / HEIGHT;
    var VIEW_ANGLE = 45;
    var NEAR = 0.1;
    var FAR = 10000;
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x212529, 1);
    container.appendChild(renderer.domElement);
    
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(500, 1000, 1600);
    camera.lookAt(new THREE.Vector3(-200, -500, 0));
    scene = new THREE.Scene();
    scene.add(camera);
    
    var fieldGeometry = new THREE.BoxGeometry(FIELD_WIDTH, 5, FIELD_LENGTH),
    fieldMaterial = new THREE.MeshLambertMaterial({ color: 0x87ff56 });
    field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.position.set(0, -50, 0);
    
    scene.add(field);
    paddle1 = addPaddle();
    paddle1.position.z = FIELD_LENGTH / 2;
    paddle2 = addPaddle();
    paddle2.position.z = -FIELD_LENGTH / 2;
    
    var ballGeometry = new THREE.SphereGeometry(BALL_RADIUS, 16, 16),
    ballMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);
    
    mainLight = new THREE.HemisphereLight(0xFFFFFF, 0x003300);
    scene.add(mainLight);
    
    updateScoreBoard();
    startRender();
    
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    var WIDTH = container.clientWidth;
    var HEIGHT = container.clientHeight;
    var ASPECT = WIDTH / HEIGHT;
    camera.aspect = ASPECT;
    camera.updateProjectionMatrix();
    renderer.setSize(WIDTH, HEIGHT);
  }

  function addPaddle() {
    var paddleGeometry = new THREE.BoxGeometry(PADDLE_WIDTH, PADDLE_HEIGHT, 10),
    paddleMaterial = new THREE.MeshLambertMaterial({ color: 0xCCCCCC }),
    paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    scene.add(paddle);
    return paddle;
  }

  function onKeyDown(event) {
    if (event.code === 'KeyA') {
      moveLeft = true;
    } else if (event.code === 'KeyD') {
      moveRight = true;
    } else if (event.code === 'ArrowLeft') {
      movePaddle2Left = true;
    } else if (event.code === 'ArrowRight') {
      movePaddle2Right = true;
    }
  }

  function onKeyUp(event) {
    if (event.code === 'KeyA') {
      moveLeft = false;
    } else if (event.code === 'KeyD') {
      moveRight = false;
    } else if (event.code === 'ArrowLeft') {
      movePaddle2Left = false;
    } else if (event.code === 'ArrowRight') {
      movePaddle2Right = false;
    }
  }

  function movePlayer1(direction) {
    if (direction === 'up') {
        moveLeft = true;
    } else if (direction === 'down') {
        moveRight = true;
    }
}

// Function to handle player 2 movement
function movePlayer2(direction) {
    if (direction === 'up') {
        movePaddle2Left = true;
    } else if (direction === 'down') {
        movePaddle2Right = true;
    }
}

// Function to stop player 1 movement
function stopMovePlayer1() {
    moveLeft = false;
    moveRight = false;
}

// Function to stop player 2 movement
function stopMovePlayer2() {
    movePaddle2Left = false;
    movePaddle2Right = false;
}
document.getElementById('left-left').addEventListener('touchstart', function() {
  movePlayer1('up');
});
document.getElementById('left-right').addEventListener('touchstart', function() {
  movePlayer1('down');
});
document.getElementById('right-up').addEventListener('touchstart', function() {
  movePlayer2('up');
});
document.getElementById('right-down').addEventListener('touchstart', function() {
  movePlayer2('down');
});

document.getElementById('left-left').addEventListener('mousedown', function() {
  movePlayer1('up');
});
document.getElementById('left-right').addEventListener('mousedown', function() {
  movePlayer1('down');
});
document.getElementById('right-up').addEventListener('mousedown', function() {
  movePlayer2('up');
});
document.getElementById('right-down').addEventListener('mousedown', function() {
  movePlayer2('down');
});


// Stop movement when buttons are released
document.getElementById('left-left').addEventListener('touchend', function() {
  stopMovePlayer1();
});
document.getElementById('left-right').addEventListener('touchend', function() {
  stopMovePlayer1();
});
document.getElementById('right-up').addEventListener('touchend', function() {
  stopMovePlayer2();
});
document.getElementById('right-down').addEventListener('touchend', function() {
  stopMovePlayer2();
});


document.getElementById('left-left').addEventListener('mouseup', function() {
  stopMovePlayer1();
});
document.getElementById('left-right').addEventListener('mouseup', function() {
  stopMovePlayer1();
});
document.getElementById('right-up').addEventListener('mouseup', function() {
  stopMovePlayer2();
});
document.getElementById('right-down').addEventListener('mouseup', function() {
  stopMovePlayer2();
});

  function processPlayerMovement() {
    if (moveLeft) {
      paddle1.position.x = Math.max(paddle1.position.x - 10, -FIELD_WIDTH / 2 + PADDLE_WIDTH / 2);
    }
    if (moveRight) {
      paddle1.position.x = Math.min(paddle1.position.x + 10, FIELD_WIDTH / 2 - PADDLE_WIDTH / 2);
    }
  }

  function processPlayer2Movement() {
    if (movePaddle2Left) {
      paddle2.position.x = Math.max(paddle2.position.x - 10, -FIELD_WIDTH / 2 + PADDLE_WIDTH / 2);
    }
    if (movePaddle2Right) {
      paddle2.position.x = Math.min(paddle2.position.x + 10, FIELD_WIDTH / 2 - PADDLE_WIDTH / 2);
    }
  }
  document.getElementById('restartButton').addEventListener('click', restartGame);

  function restartGame() {
    $('#declaration').hide();
    reset();
    init();
  }
})(window, window.document, window.THREE);