
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartButton = document.getElementById("restart");
const resetScoresButton = document.getElementById("resetScores");
const modeButtons = document.querySelectorAll(".mode");

const scoreXText = document.getElementById("scoreX");
const scoreOText = document.getElementById("scoreO");
const scoreDrawText = document.getElementById("scoreDraw");
const playerOLabel = document.getElementById("playerOLabel");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let mode = "pvp";

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

modeButtons.forEach(button => {
    button.addEventListener("click", () => {
        modeButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        mode = button.dataset.mode;

        playerOLabel.textContent =
            mode === "computer" ? "COMPUTER" : "PLAYER O";

        resetRound();
    });
});

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = Number(cell.dataset.index);

        if (!gameActive || board[index] !== "") {
            return;
        }

        makeMove(index, currentPlayer);

        if (!gameActive) {
            return;
        }

        switchPlayer();

        if (mode === "computer" && currentPlayer === "O") {
            gameActive = false;
            statusText.textContent = "Computer is thinking...";

            setTimeout(() => {
                computerMove();
            }, 400);
        }
    });
});

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player);
    checkWinner();
}

function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    statusText.textContent =
        mode === "computer" && currentPlayer === "O"
        ? "Computer's turn"
        : mode === "computer"
        ? "Your turn (X)"
        : `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
    for (let combination of winningConditions) {
        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            gameActive = false;

            combination.forEach(index => {
                cells[index].classList.add("winner");
            });

            statusText.textContent =
                board[a] === "X"
                ? "🎉 Player X wins!"
                : mode === "computer"
                ? "🤖 Computer wins!"
                : "🎉 Player O wins!";

            if (board[a] === "X") {
                scoreX++;
                scoreXText.textContent = scoreX;
            } else {
                scoreO++;
                scoreOText.textContent = scoreO;
            }

            return;
        }
    }

    if (!board.includes("")) {
        gameActive = false;
        statusText.textContent = "It's a draw!";

        scoreDraw++;
        scoreDrawText.textContent = scoreDraw;

        return;
    }

    gameActive = true;
}

function findWinningMove(player) {
    for (let combination of winningConditions) {
        const [a, b, c] = combination;
        const values = [board[a], board[b], board[c]];

        if (
            values.filter(value => value === player).length === 2 &&
            values.includes("")
        ) {
            return combination[values.indexOf("")];
        }
    }

    return null;
}

function computerMove() {
    let move = findWinningMove("O");

    if (move === null) {
        move = findWinningMove("X");
    }

    if (move === null && board[4] === "") {
        move = 4;
    }

    if (move === null) {
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(index => board[index] === "");

        if (availableCorners.length > 0) {
            move = availableCorners[
                Math.floor(Math.random() * availableCorners.length)
            ];
        }
    }

    if (move === null) {
        const availableCells = board
            .map((value, index) => value === "" ? index : null)
            .filter(index => index !== null);

        if (availableCells.length === 0) {
            checkWinner();
            return;
        }

        move = availableCells[
            Math.floor(Math.random() * availableCells.length)
        ];
    }

    makeMove(move, "O");

    if (gameActive) {
        currentPlayer = "X";
        statusText.textContent = "Your turn (X)";
    }
}

function resetRound() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    statusText.textContent = "Player X's turn";

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("X", "O", "winner");
    });
}

function restartGame() {
    scoreX = 0;
    scoreO = 0;
    scoreDraw = 0;

    scoreXText.textContent = 0;
    scoreOText.textContent = 0;
    scoreDrawText.textContent = 0;

    resetRound();
}

restartButton.addEventListener("click", resetRound);
resetScoresButton.addEventListener("click", restartGame);
