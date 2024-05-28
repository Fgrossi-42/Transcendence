import { initializeAI } from './gameVSai.js';
import { initializePlayer } from './gameVSplayer.js';
import { initializeTournament } from './gameTournament.js';

const buttonTournament = document.getElementById("startTournamentButton");
const buttonPlayer = document.getElementById("startgameVSplayerButton");
const buttonAI = document.getElementById("startgameVSaiButton");

buttonTournament.addEventListener("click", function () {
	initializeTournament();
});

buttonPlayer.addEventListener("click", function () {
	initializePlayer();
});

buttonAI.addEventListener("click", function () {
	initializeAI();
});
