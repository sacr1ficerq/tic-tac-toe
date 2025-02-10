const express = require("express");
const http = require("http").Server(express);
const socketio = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:5174", // Allow requests from this origin
        methods: ["GET", "POST"], // Allow specific HTTP methods
    },
});

var board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];

var player = 'X'

// Enable CORS for Express (if you have HTTP routes)
const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5174"); // Allow requests from your frontend
    next();
});

http.listen(3000, () => {
    console.log("Listening on port 3000");
});

socketio.on("connection", (socket) => {
    console.log("A user connected");
    socketio.emit("board", board);
    socketio.emit("player", player);
    socket.on("makeMove", (x, y, player) => {
        if (board[x][y] === '') {
            board[x][y] = player;
            player = player == 'X' ? 'O' : 'X';
            socketio.emit("board", board);
            socketio.emit("player", player);
        }
    });
    socket.on("resetGame", () => {
        board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ];
        player = 'X';
        socketio.emit("board", board);
        socketio.emit("player", player);
    });
});
