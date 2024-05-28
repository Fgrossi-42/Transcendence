import {Pong} from './gameLogic.js'

var rounds = [5, 5, 3, 3, 2];
var playerLeftName = "Player1";
var playerRightName = "Player2";

let goDown = new KeyboardEvent("keydown", {
	key: "k",
	keyCode: 75,
	which: 75,

	bubbles: true,
	cancelable: true,
	charCode: 0,
	shiftKey: false,
	altKey: false,
	ctrlKey: false,
	metaKey: false,
	repeat: false,
	location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD
});

let stopGoDown = new KeyboardEvent("keyup", {
	key: "k",
	keyCode: 75,
	which: 75,

	bubbles: true,
	cancelable: true,
	charCode: 0,
	shiftKey: false,
	altKey: false,
	ctrlKey: false,
	metaKey: false,
	repeat: false,
	location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD
});

let goUp = new KeyboardEvent("keydown", {
	key: "o",
	keyCode: 79,
	which: 79,

	bubbles: true,
	cancelable: true,
	charCode: 0,
	shiftKey: false,
	altKey: false,
	ctrlKey: false,
	metaKey: false,
	repeat: false,
	location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD
});

let stopGoUp = new KeyboardEvent("keyup", {
	key: "o",
	keyCode: 79,
	which: 79,

	bubbles: true,
	cancelable: true,
	charCode: 0,
	shiftKey: false,
	altKey: false,
	ctrlKey: false,
	metaKey: false,
	repeat: false,
	location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD
});


export function initializeAI () {
	Pong.finalize();
	alert("Be the Force with you!");
	Pong.initialize(playerLeftName, playerRightName, rounds);
	document.dispatchEvent(goDown);
}
