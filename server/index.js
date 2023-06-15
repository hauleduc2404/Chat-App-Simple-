var express = require('express')
const http = require("http");
var app = express();
const server = http.createServer(app);


let chatHistory = {};


const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
  }); 

  socketIo.on("connection", (socket) => {
    console.log("New client connected" + socket.id);

    socket.on("join_room", (data) => {
        socket.join(data);
        socket.emit('joined_room', data);
    });

    socket.on("send_message", (data) => {
        console.log('Send message to:', data.room);
        socket.to(data.room).emit("receive_message", data);


        if (!chatHistory[data.room]) chatHistory[data.room] = [];

        chatHistory[data.room].push(data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
  });

  server.listen(3000, () => {
        console.log('Server dang chay tren cong 3000');
  });