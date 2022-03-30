const squares = document.getElementsByClassName("square");
var next = 'X';
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
var pastWinners = [];
var players = {'X': null, 'O': null};

let toggle = (event) => {
  if (gameOver === false) {
    if (next === 'X' && event.target.innerText === '') {
      event.target.innerText = 'X';
      board[event.target.value] = 'X';
      next = 'O';
      $('#next').html(`Next move: ${players.O} (O)`);
    } else if (next === 'O' && event.target.innerText === '') {
      event.target.innerText = 'O';
      board[event.target.value] = 'O';
      next = 'X';
      $('#next').html(`Next move: ${players.X} (X)`);
    }
    winnerCheck();
  }
}

let winnerCheck = () => {
  for (let line = 0; line < winCombos.length; line++) {
    [a, b, c] = winCombos[line];
    if (board[a] === board[b] && board[b] === board[c] && board[a] !== null) {
      winner.innerText = `Winner is ${players[board[a]]} playing ${board[a]}!`;
      winner.style.display = "block";
      pastWinners.push(board[a]);
      gameOver = true;
      return;
    }
  }

  if (!board.includes(null)) {
    winner.innerText = `Tied game between ${players.X} & ${players.O}!`;
    winner.style.display = "block";
    gameOver = true;
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
  next = pastWinners[pastWinners.length - 1] ? pastWinners[pastWinners.length - 1] : 'X';
}

window.onload = () => {
  // adding event listeners
  for (let i = 0; i < squares.length; i++) {
    squares.item(i).addEventListener("click", toggle);
  };
  
  document.body.getElementsByClassName("clear")[0].addEventListener("click", clearBoard);

  players.X = window.prompt('Enter player X name: ');
  players.O = window.prompt('Enter player O name: ');
  $('#vs span').html(`${players.X} (X) vs. ${players.O} (O)`).css('display', 'flex');
  $('#next').html(`Next move: ${players.X} (X)`);
};