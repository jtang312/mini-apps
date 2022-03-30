const squares = document.getElementsByClassName("square");
var next = 1;
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
var board = new Array(9).fill(null);
var winner = document.createElement('div');
winner.classList.add("winner");
document.getElementById("result").appendChild(winner);
var gameOver = false;

let toggle = (event) => {
  if (gameOver === false) {
    if (next === 1 && event.target.innerText === '') {
      event.target.innerText = 'X';
      board[event.target.value] = 'X';
      next = 0;
    } else if (next === 0 && event.target.innerText === '') {
      event.target.innerText = 'O';
      board[event.target.value] = 'O';
      next = 1;
    }
    winnerCheck();
  }
}

let winnerCheck = () => {
  for (let line = 0; line < winCombos.length; line++) {
    [a, b, c] = winCombos[line];
    if (board[a] === board[b] && board[b] === board[c] && board[a] !== null) {
      winner.innerText = `Winner is ${board[a]}!`;
      winner.style.display = "block";
      gameOver = true;
      return;
    }
  }
  return null;
};

let clearBoard = () => {
  for (let i = 0; i < squares.length; i++) {
    console.log(squares.item(i).innerText);
    squares.item(i).innerText = '';
    board[i] = null;
  };
  if (winner.innerText) { 
    winner.innerText = '';
    winner.style.display = "none";
  }
  gameOver = false;
  next = 1;
}

// adding event listeners
for (let i = 0; i < squares.length; i++) {
  squares.item(i).addEventListener("click", toggle);
};

document.body.getElementsByClassName("clear")[0].addEventListener("click", clearBoard);