const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const GameModel = require("./GameModel");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const game = new GameModel();

app.use(express.static(__dirname + "/"));

app.get("/", (req, res) => {
  // res.sendFile("index.html", { root: ".." });
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  const id = socket.conn.id;

  const response = game.addPlayerSingleGame(id);
  socket.emit("start_game", response);

  socket.on("play", (args) => {
    const res = game.playTurn(args["player"], args["row"], args["col"]);
    socket.broadcast.emit("opp_play", args);
    if (res === 0) {
      io.emit("win", args["player"]);
    }
  });

  socket.on("disconnect", () => {
    game.removePlayerSingleGame(id);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
