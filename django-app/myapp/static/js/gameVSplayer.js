import {Pong} from './gameLogic.js'

var rounds = [3];
var playerLeftName = "Player1";
var playerRightName = "Player2";

export function initializePlayer () {
	Pong.finalize();
	Pong.initialize(playerLeftName, playerRightName, rounds);
	return Pong;
}
