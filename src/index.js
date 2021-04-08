const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirPath = path.join(__dirname, "../public");

app.use(express.static(publicDirPath));

io.on("connection", (socket) => {
  console.log("new websocket connection");
  socket.emit("message", "Welcome to the chat application!");
  socket.broadcast.emit("message", "A new user has joined!");

  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });
  socket.on("sendLocation", (coords) => {
    io.emit(
      "message",
      `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
  });

  socket.on("disconnect", () => {
    io.emit("message", "user has left!");
  });
});

server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
