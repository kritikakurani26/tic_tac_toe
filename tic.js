let game = [];
let currPlayer = "X";
let scoreX = 0;
let scoreO = 0;
const SIZE = 3;

var socket = io();

document.addEventListener("DOMContentLoaded", function () {
  var isPlayerLocked = false;
  socket.on("start_game", (response) => {
    if (response == "O") {
      currPlayer = "O";
      // alert("You are playing as O");
    } else if (response == "X") {
      currPlayer = "X";
      // alert("You are playing as X");
    } else {
      isPlayerLocked = true;
    }
    console.log(response, isPlayerLocked);
    initialize(isPlayerLocked);
  });
});

// Create buttons for tic tac toe
function initialize(isPlayerLocked) {
  var grid = document.querySelector("#grid");
  grid.replaceChildren();
  game = [];
  for (let i = 0; i < SIZE; i++) {
    const row = [];
    for (let j = 0; j < SIZE; j++) {
      row.push(null);
      grid.appendChild(createButton(i, j, isPlayerLocked));
    }
    game.push(row);
  }

  // currPlayer = "X";
  document.getElementById("result").innerText = "";
}

function createButton(row, col, isDisabled) {
  const item = document.createElement("button");
  item.setAttribute("type", "button");
  // item.setAttribute("onClick", "onButtonClick(" + row + "," + col + ")");
  item.onclick = function () {
    onButtonClickV2(row, col);
  };

  item.setAttribute("class", "grid-item");
  item.setAttribute("id", "b" + row + col);
  if (isDisabled) {
    item.setAttribute("disabled", true);
  }

  item.appendChild(document.createTextNode(""));

  const newDiv = document.createElement("div");
  newDiv.appendChild(item);
  return newDiv;
}

function onButtonClickV2(row, col) {
  const box = document.getElementById("b" + row + col);
  if (box.textContent !== "") {
    return;
  }
  box.textContent = currPlayer;
  game[row][col] = currPlayer;
  socket.emit("play", { player: currPlayer, row: row, col: col });
}

socket.on("opp_play", (args) => {
  console.log(args);
  const box = document.getElementById("b" + args["row"] + args["col"]);
  box.textContent = args["player"];
});

socket.on("win", (args) => {
  console.log(args);
});

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

// function evaluate() {
//   for (let i = 0; i < SIZE; i++) {
//     if (evalRow(i) === true) {
//       return true;
//     }
//   }
//   for (let i = 0; i < SIZE; i++) {
//     if (evalCol(i) === true) {
//       return true;
//     }
//   }
//   return evalDiagonal1() || evalDiagonal2();
// }

// function evalRow(rowNum) {
//   for (let j = 0; j < SIZE - 1; j++) {
//     if (game[rowNum][j] == null || game[rowNum][j] !== game[rowNum][j + 1]) {
//       return false;
//     }
//   }
//   return true;
// }

// function evalCol(colNum) {
//   for (let i = 0; i < SIZE - 1; i++) {
//     if (game[i][colNum] == null || game[i][colNum] !== game[i + 1][colNum]) {
//       return false;
//     }
//   }
//   return true;
// }

// function evalDiagonal1() {
//   for (let i = 0; i < SIZE - 1; i++) {
//     if (game[i][i] == null || game[i][i] !== game[i + 1][i + 1]) {
//       return false;
//     }
//   }
//   return true;
// }

// function evalDiagonal2() {
//   let j = SIZE;
//   for (let i = 0; i < SIZE - 1; i++) {
//     j -= 1;
//     if (game[i][j] == null || game[i][j] !== game[i + 1][j - 1]) {
//       return false;
//     }
//   }

//   return true;
// }
