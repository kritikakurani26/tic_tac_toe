let game = [];
let currPlayer = "X";
let scoreX = 0;
let scoreO = 0;
const SIZE = 3;

// Create buttons for tic tac toe
document.addEventListener("DOMContentLoaded", function () {
  initialize();
});

function initialize() {
  var grid = document.querySelector("#grid");
  grid.replaceChildren();
  game = [];
  for (let i = 0; i < SIZE; i++) {
    const row = [];
    for (let j = 0; j < SIZE; j++) {
      row.push(null);
      grid.appendChild(createButton(i, j));
    }
    game.push(row);
  }

  currPlayer = "X";
  document.getElementById("result").innerText = "";
}

function createButton(row, col) {
  const item = document.createElement("button");
  item.setAttribute("type", "button");
  item.setAttribute("onClick", "onButtonClick(" + row + "," + col + ")");
  item.setAttribute("class", "grid-item");
  item.setAttribute("id", "b" + row + col);

  item.appendChild(document.createTextNode(""));

  const newDiv = document.createElement("div");
  newDiv.appendChild(item);
  return newDiv;
}

function onButtonClick(row, col) {
  const box = document.getElementById("b" + row + col);
  if (box.textContent !== "") {
    return;
  }
  box.textContent = currPlayer;
  game[row][col] = currPlayer;

  if (evaluate() === true) {
    const result = document.getElementById("result");
    result.innerText = "Player" + currPlayer + " wins!";

    if (currPlayer == "X") {
      scoreX += 1;
    } else {
      scoreO += 1;
    }
    document.getElementById("scores").innerText =
      "Scores: PlayerX: " + scoreX + ", PlayerO: " + scoreO;

    let buttons = document.querySelectorAll(".grid-item");
    buttons.forEach((button) => button.setAttribute("disabled", "true"));

    currPlayer = "X";
    return;
  }

  currPlayer = currPlayer == "X" ? "O" : "X";
}

function evaluate() {
  for (let i = 0; i < SIZE; i++) {
    if (evalRow(i) === true) {
      return true;
    }
  }
  for (let i = 0; i < SIZE; i++) {
    if (evalCol(i) === true) {
      return true;
    }
  }
  return evalDiagonal1() || evalDiagonal2();
}

function evalRow(rowNum) {
  for (let j = 0; j < SIZE - 1; j++) {
    if (game[rowNum][j] == null || game[rowNum][j] !== game[rowNum][j + 1]) {
      return false;
    }
  }
  return true;
}

function evalCol(colNum) {
  for (let i = 0; i < SIZE - 1; i++) {
    if (game[i][colNum] == null || game[i][colNum] !== game[i + 1][colNum]) {
      return false;
    }
  }
  return true;
}

function evalDiagonal1() {
  for (let i = 0; i < SIZE - 1; i++) {
    if (game[i][i] == null || game[i][i] !== game[i + 1][i + 1]) {
      return false;
    }
  }
  return true;
}

function evalDiagonal2() {
  let j = SIZE;
  for (let i = 0; i < SIZE - 1; i++) {
    j -= 1;
    if (game[i][j] == null || game[i][j] !== game[i + 1][j - 1]) {
      return false;
    }
  }

  return true;
}
