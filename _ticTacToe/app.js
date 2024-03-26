let gameOver = false;
counter = 0;

class Tile {
  constructor(r, c) {
    this.value = null;
    this.column = c;
    this.row = r;
  }
}

let board = [
  [new Tile(0, 0), new Tile(0, 1), new Tile(0, 2)],
  [new Tile(1, 0), new Tile(1, 1), new Tile(1, 2)],
  [new Tile(2, 0), new Tile(2, 1), new Tile(2, 2)],
];

function winner(player) {
  document.getElementById("winnerText").innerHTML = "Winner is " + player + "!";
  gameOver = true;
}

function checkWinCondition() {
  //horizontal
  for (let a = 0; a < 3; a++) {
    if (
      board[a][0]?.value == "X" &&
      board[a][1]?.value == "X" &&
      board[a][2]?.value == "X"
    ) {
      winner("X");
    } else if (
      board[a][0]?.value == "O" &&
      board[a][1]?.value == "O" &&
      board[a][2]?.value == "O"
    ) {
      winner("O");
    }
  }
  // vertical
  for (let a = 0; a < 3; a++) {
    if (
      board[0][a].value == "X" &&
      board[1][a].value == "X" &&
      board[2][a].value == "X"
    ) {
      winner("X");
    } else if (
      board[0][a].value == "O" &&
      board[1][a].value == "O" &&
      board[2][a].value == "O"
    ) {
      winner("O");
    }
  }
  // diagonal
  if (
    board[0][0].value == "X" &&
    board[1][1].value == "X" &&
    board[2][2].value == "X"
  ) {
    winner("X");
  } else if (
    board[0][0].value == "O" &&
    board[1][1].value == "O" &&
    board[2][2].value == "O"
  ) {
    winner("O");
  } else if (
    board[2][0].value == "X" &&
    board[1][1].value == "X" &&
    board[0][2].value == "X"
  ) {
    winner("X");
  } else if (
    board[2][0].value == "O" &&
    board[1][1].value == "O" &&
    board[0][2].value == "O"
  ) {
    winner("O");
  }

  // if all tiles are filled
  if (counter == 9) {
    document.getElementById("winnerText").innerHTML = "Draw :(";
    gameOver = true;
  }
}

let xTurn = true;

function placePiece(element, b) {
  if (gameOver) {
    return;
  }

  if (xTurn && b.value == null) {
    element.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
    b.value = "X";
    xTurn = !xTurn;
    counter++;
  } else if (xTurn == false && b.value == null) {
    element.innerHTML = '<i class="fa fa-circle-o" aria-hidden="true"></i>';
    b.value = "O";
    xTurn = !xTurn;
    counter++;
  }

  checkWinCondition();
  console.log("\n \n ");
}

let item0 = document.getElementById("item0");
let item1 = document.getElementById("item1");
let item2 = document.getElementById("item2");
let item3 = document.getElementById("item3");
let item4 = document.getElementById("item4");
let item5 = document.getElementById("item5");
let item6 = document.getElementById("item6");
let item7 = document.getElementById("item7");
let item8 = document.getElementById("item8");

item0.setAttribute("onclick", "placePiece(item0, board[0][0])");
item1.setAttribute("onclick", "placePiece(item1, board[0][1])");
item2.setAttribute("onclick", "placePiece(item2, board[0][2])");
item3.setAttribute("onclick", "placePiece(item3, board[1][0])");
item4.setAttribute("onclick", "placePiece(item4, board[1][1])");
item5.setAttribute("onclick", "placePiece(item5, board[1][2])");
item6.setAttribute("onclick", "placePiece(item6, board[2][0])");
item7.setAttribute("onclick", "placePiece(item7, board[2][1])");
item8.setAttribute("onclick", "placePiece(item8, board[2][2])");
