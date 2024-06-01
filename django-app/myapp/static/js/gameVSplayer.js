import {Pong} from './gameLogic.js'

var rounds = [5, 5, 3, 3, 2];
var playerLeftName = "Player1";
var playerRightName = "Player2";

export function initializePlayer () {
	Pong.finalize();
	alert("May the Force be with you!");
	Pong.initialize(playerLeftName, playerRightName, rounds);
}
