import { initializeAI } from './old_gameVSai.js';
import { initializePlayer } from './gameVSplayer.js';
import { initializeTournament } from './old_tournament.js';

// Global variable to keep track of the current game instance
let currentGame = null;

const buttonTournament = document.getElementById("startTournamentButton");
const buttonPlayer = document.getElementById("startgameVSplayerButton");
const buttonAI = document.getElementById("startgameVSaiButton");

buttonTournament.addEventListener("click", function () {
    stopCurrentGame();
    initializeTournament();
});

buttonPlayer.addEventListener("click", function () {
    stopCurrentGame();
    initializePlayer();
});

buttonAI.addEventListener("click", function () {
    stopCurrentGame();
    initializeAI();
});

// Function to stop the current game
function stopCurrentGame() {
    if (currentGame && currentGame.stop) {
        currentGame.stop();
    }
}

// Export function to set the current game instance
export function setCurrentGame(gameInstance) {
    currentGame = gameInstance;
}
