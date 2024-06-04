document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const winnerElement = document.getElementById('winner');
    const restartBtn = document.getElementById('restartBtn');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameOver = false;

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    function renderBoard() {
        boardElement.innerHTML = '';
        board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.textContent = cell;
            cellElement.addEventListener('click', () => makeMove(index));
            boardElement.appendChild(cellElement);
        });
    }

    function makeMove(index) {
        if (board[index] === '' && !gameOver) {
            board[index] = currentPlayer;
            if (checkWinner()) {
                winnerElement.textContent = `Player ${currentPlayer} Wins!`;
                gameOver = true;
            } else if (board.every(cell => cell !== '')) {
                winnerElement.textContent = 'Draw!';
                gameOver = true;
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
            renderBoard();
        }
    }

    function checkWinner() {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return board[index] === currentPlayer;
            });
        });
    }

    restartBtn.addEventListener('click', () => {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameOver = false;
        winnerElement.textContent = '';
        renderBoard();
    });

    renderBoard();
});
