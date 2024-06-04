import {Pong} from './gameLogic.js'
// import {} from './AiPlayer.js'


var rounds = [5, 5, 3, 3, 2];
var playerLeftName = "Player1";
var playerRightName = "Player2";

let workerAI;

export function initializeAI () {
	Pong.finalize();

	workerAI = new Worker('/static/js/AiPlayer.js');
	console.log("sending message to worker AI");
	workerAI.postMessage("start");
	
	workerAI.onerror = function(error) {
		console.error("AI Worker error:", error.message);
		workerAI.terminate();
	};

    workerAI.onmessage = function(event) {
        handleAIEvent(event.data);
    };

	alert("Be the Force with you!");
	Pong.initialize(playerLeftName, playerRightName, rounds);
}

function handleAIEvent(data) {
    if (data === "goDown")		document.dispatchEvent(goDown);
    if (data === "stopGoDown")	document.dispatchEvent(stopGoDown);
    if (data === "goUp")		document.dispatchEvent(goUp);
    if (data === "stopGoUp")	document.dispatchEvent(stopGoUp);
}

let goDown = new KeyboardEvent("keydown", {
	key: "k",
	keyCode: 75,
	which: 75,
	location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD
});

let stopGoDown = new KeyboardEvent("keyup", {
	key: "k",
	keyCode: 75,
	which: 75,
	location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD
});

let goUp = new KeyboardEvent("keydown", {
	key: "o",
	keyCode: 79,
	which: 79,
	location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD
});

let stopGoUp = new KeyboardEvent("keyup", {
	key: "o",
	keyCode: 79,
	which: 79,
	location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD
});
