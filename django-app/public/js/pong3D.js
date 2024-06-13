console.clear();

(function (window, document, THREE) {
  // "constants"... 
  var WIDTH = 700,
    HEIGHT = 500,
    VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000,
    FIELD_WIDTH = 1300,
    FIELD_LENGTH = 2000,
    BALL_RADIUS = 20,
    PADDLE_WIDTH = 200,
    PADDLE_HEIGHT = 30,

    //get the scoreboard element.
    scoreBoard = document.getElementById('scoreBoard'),

    //declare members.
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
    stopBall();
    setTimeout(reset, 2000);
  }

  function updateScoreBoard() {
    scoreBoard.innerHTML = 'Player 1: ' + score.player1 + ' Player 2: ' +
      score.player2;
  }

  function stopBall() {
    ball.$stopped = true;
  }

  function addPoint(playerName) {
    score[playerName]++;
    console.log(score);
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
      console.log("Rendering frame");
      processBallMovement();
      processPlayerMovement();
      processPlayer2Movement();

      renderer.render(scene, camera);
    }
  }

  function reset() {
    ball.position.set(0, 0, 0);
    ball.$velocity = null;
  }

  function init() {
    container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x212529, 1);
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(500, 1000, 1600);  // Position higher and farther back
    camera.lookAt(new THREE.Vector3(-200, -500, 0));  // Look at the center
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

  init();
})(window, window.document, window.THREE);
