const express = require("express");
const http = require("http").Server(express);
const socketio = require("socket.io")(http);


var board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

http.listen(3000, () => {
    console.log("Listening on port 3000");
});

socketio.on("connection", socket => {
    socket.emit("board", board);
});

