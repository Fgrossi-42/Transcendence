var turn = document.getElementById("turn");
var boxes = document.querySelectorAll("#main div");
var X_or_O = 0;
var gameEnded = false;  // Flag to track if the game has ended

function selectWinnerBoxes(b1, b2, b3) {
    b1.classList.add("win");
    b2.classList.add("win");
    b3.classList.add("win");
    turn.innerHTML = b1.innerHTML + " is a winner";
    sendGameResultToBackend(b1.innerHTML);
    turn.style.fontSize = "40px";
    gameEnded = true;  // Set gameEnded flag to true
}

function getWinner() {
    var box1 = document.getElementById("box1"),
        box2 = document.getElementById("box2"),
        box3 = document.getElementById("box3"),
        box4 = document.getElementById("box4"),
        box5 = document.getElementById("box5"),
        box6 = document.getElementById("box6"),
        box7 = document.getElementById("box7"),
        box8 = document.getElementById("box8"),
        box9 = document.getElementById("box9");

    if (box1.innerHTML !== "" && box1.innerHTML === box2.innerHTML && box1.innerHTML === box3.innerHTML)
        selectWinnerBoxes(box1, box2, box3);

    if (box4.innerHTML !== "" && box4.innerHTML === box5.innerHTML && box4.innerHTML === box6.innerHTML)
        selectWinnerBoxes(box4, box5, box6);

    if (box7.innerHTML !== "" && box7.innerHTML === box8.innerHTML && box7.innerHTML === box9.innerHTML)
        selectWinnerBoxes(box7, box8, box9);

    if (box1.innerHTML !== "" && box1.innerHTML === box4.innerHTML && box1.innerHTML === box7.innerHTML)
        selectWinnerBoxes(box1, box4, box7);

    if (box2.innerHTML !== "" && box2.innerHTML === box5.innerHTML && box2.innerHTML === box8.innerHTML)
        selectWinnerBoxes(box2, box5, box8);

    if (box3.innerHTML !== "" && box3.innerHTML === box6.innerHTML && box3.innerHTML === box9.innerHTML)
        selectWinnerBoxes(box3, box6, box9);

    if (box1.innerHTML !== "" && box1.innerHTML === box5.innerHTML && box1.innerHTML === box9.innerHTML)
        selectWinnerBoxes(box1, box5, box9);

    if (box3.innerHTML !== "" && box3.innerHTML === box5.innerHTML && box3.innerHTML === box7.innerHTML)
        selectWinnerBoxes(box3, box5, box7);

    // Check if all boxes are filled without a winner
    var allBoxesFilled = true;
    boxes.forEach(box => {
        if (box.innerHTML === "") {
            allBoxesFilled = false;
        }
    });

    // If all boxes are filled and no winner, it's a draw
    if (allBoxesFilled && !gameEnded) {
        turn.innerHTML = "It's a Draw!";
        gameEnded = true;
    }
}

function sendGameResultToBackend(result) {
    fetch('/record_tic_tac_toe_game/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            result: result,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Game result recorded:', data);
        // Optional: Update game history UI
        updateGameHistory(data.game);
    })
    .catch(error => {
        console.error('Error recording game result:', error);
    });
    console.log('Sending data:', JSON.stringify({ result: result }));
}

function updateGameHistory(game) {
    var gameHistoryElement = document.getElementById('game-history');
    var gameElement = document.createElement('li');

    // Format the game information to display
    var gameInfo = `Winner: ${game.winner}, Details: ${game.details}`; // Modify this based on your backend response

    gameElement.textContent = gameInfo;
    gameHistoryElement.appendChild(gameElement);
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

for (var i = 0; i < boxes.length; i++) {
    boxes[i].onclick = function () {
        if (!gameEnded && this.innerHTML !== "X" && this.innerHTML !== "O") {
            if (X_or_O % 2 === 0) {
                console.log(X_or_O);
                this.innerHTML = "X";
                turn.innerHTML = "O Turn Now";
                getWinner();
                X_or_O += 1;

            } else {
                console.log(X_or_O);
                this.innerHTML = "O";
                turn.innerHTML = "X Turn Now";
                getWinner();
                X_or_O += 1;
            }
        }
    };
}

document.getElementById('replay').addEventListener('click', replay);

function replay() {
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].classList.remove("win");
        boxes[i].innerHTML = "";
        turn.innerHTML = "Play";
        turn.style.fontSize = "25px";
    }
    gameEnded = false;  // Reset gameEnded flag
    X_or_O = 0;  // Reset move counter
}

document.addEventListener('DOMContentLoaded', function() {
  fetchGameHistory();  // Fetch game history when the page loads
});

function fetchGameHistory() {
  fetch('/fetch_game_history/', {  // Replace with your Django URL to fetch game history
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      console.log('Game history fetched:', data);
      displayGameHistory(data.game_history);  // Update UI with fetched game history
  })
  .catch(error => {
      console.error('Error fetching game history:', error);
  });
}

function displayGameHistory(gameHistory) {
  var gameHistoryElement = document.getElementById('game-history');
  gameHistoryElement.innerHTML = '';  // Clear existing content

  gameHistory.forEach(game => {
      var gameElement = document.createElement('li');
      gameElement.textContent = `Winner: ${game.winner}, Details: ${game.details}`;
      gameHistoryElement.appendChild(gameElement);
  });
}
