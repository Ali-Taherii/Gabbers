const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.ALLOWED_ORIGIN || "*" },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  const { roomId } = socket.handshake.query;
  socket.join(roomId);
  console.log(`Socket ${socket.id} joined room ${roomId}`);

  const clients = io.sockets.adapter.rooms.get(roomId);
  if (clients && clients.size > 1) {
    socket.emit("room-joined", { initiator: false });
  } else {
    socket.emit("room-joined", { initiator: true });
  }

  socket.on("signal", (data) => {
    socket.to(roomId).emit("signal", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
