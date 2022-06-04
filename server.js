import express from "express";
import http from "http";
import { Server } from "socket.io";
import GameModel from "./GameModel.js";
import { Events } from "./events.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const game = new GameModel();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + "/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  const id = socket.conn.id;

  const response = game.addPlayer(id);
  const roomId = response.roomId;

  socket.join(roomId);
  socket.emit(Events.START_GAME, response.status);

  socket.on(Events.PLAY, (args) => {
    const res = game.playTurn(id, args["player"], args["row"], args["col"]);
    socket.to(roomId).emit(Events.OPP_PLAY, args);
    if (res === 0) {
      io.to(roomId).emit(Events.WIN, args["player"]);
    }
  });

  socket.on("disconnect", () => {
    game.removePlayer(id);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
