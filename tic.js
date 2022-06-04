import { Events } from "./events.js";

let game = [];
let currPlayer = "";
let scoreX = 0;
let scoreO = 0;

const SIZE = 3;
const INST_YOUR_TURN = "It's your turn to play!";
const INST_OPP_TURN = "Waiting for opponent to play!";

var socket = io();

document.addEventListener("DOMContentLoaded", function () {
  var isPlayerLocked = false;
  const player = document.getElementById("playing_as");
  socket.on(Events.START_GAME, (response) => {
    if (response !== "O" || response != "X") {
      isPlayerLocked = true;
    }
    initialize(isPlayerLocked);

    if (response == "O") {
      myTurn();
      currPlayer = "O";
      player.innerHTML = "You are playing as O";
    } else if (response == "X") {
      oppTurn();
      currPlayer = "X";
      player.innerHTML = "You are playing as X";
    }
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
}

function createButton(row, col, isDisabled) {
  const item = document.createElement("button");
  item.setAttribute("type", "button");
  item.onclick = function () {
    onButtonClick(row, col);
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

function onButtonClick(row, col) {
  const box = document.getElementById("b" + row + col);
  if (box.textContent !== "") {
    return;
  }
  box.textContent = currPlayer;
  game[row][col] = currPlayer;
  socket.emit(Events.PLAY, { player: currPlayer, row: row, col: col });
  oppTurn();
}

socket.on(Events.OPP_PLAY, (args) => {
  const box = document.getElementById("b" + args["row"] + args["col"]);
  box.textContent = args["player"];
  myTurn();
});

socket.on(Events.WIN, (player) => {
  if (player == "O") {
    scoreO += 1;
  } else {
    scoreX += 1;
  }
  document.getElementById("scores").innerText =
    "Scores: PlayerX: " + scoreX + ", PlayerO: " + scoreO;
  alert("Player " + player + " won!");
  disableAllButtons();
});

function myTurn() {
  document.getElementById("instruction").innerText = INST_YOUR_TURN;
  const elements = document.querySelectorAll('[id^="b"]');
  elements.forEach((elem) => elem.removeAttribute("disabled"));
}

function oppTurn() {
  document.getElementById("instruction").innerText = INST_OPP_TURN;
  disableAllButtons();
}

function disableAllButtons() {
  const elements = document.querySelectorAll('[id^="b"]');
  elements.forEach((elem) => elem.setAttribute("disabled", true));
}
