import {Pong} from './gameLogic.js'

var players = [];
var tournamentBracket = [];
var currentMatch = 0;
var matchResults = [];
var rounds = [3];

// Shuffle Array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Create Bracket
function createBracket(players) {
    let bracket = [];
    for (let i = 0; i < players.length; i += 2) {
        bracket.push([players[i], players[i + 1]]);
    }
    return bracket;
}

// Start Next Match
function startNextMatch() {
    if (currentMatch < tournamentBracket.length) {
        let match = tournamentBracket[currentMatch];
        Pong.finalize();
        alert("Next match: " + match[0] + " vs " + match[1]);
        Pong.initialize(match[0], match[1], rounds);
    } else {
        if (tournamentBracket.length > 1) {
            advanceTournament();
        } else {
            alert("Champion: " + tournamentBracket[0][0]);
        }
    }
}

// Advance Tournament
function advanceTournament() {
    let winners = [];
    for (let i = 0; i < matchResults.length; i++) {
        winners.push(matchResults[i]);
    }
    tournamentBracket = createBracket(winners);
    currentMatch = 0;
    matchResults = [];
    startNextMatch();
}

// Initialize Tournament
export function initializeTournament() {
    players = [];
    for (let i = 0; i < 8; i++) {
        let playerName = prompt("Enter name for Player " + (i + 1));
        if (playerName) {
            players.push(playerName);
        } else {
            i--;
        }
    }
    shuffle(players);
    tournamentBracket = createBracket(players);
    currentMatch = 0;
    matchResults = [];
    startNextMatch();
}
