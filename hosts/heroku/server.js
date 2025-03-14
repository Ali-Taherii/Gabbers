const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  const { roomId } = socket.handshake.query;
  socket.join(roomId);
  console.log(`Socket ${socket.id} joined room ${roomId}`);

  // Determine if this socket should be the offer initiator.
  const clients = io.sockets.adapter.rooms.get(roomId);
  if (clients && clients.size > 1) {
    socket.emit("room-joined", { initiator: false });
  } else {
    socket.emit("room-joined", { initiator: true });
  }

  socket.on("signal", (data) => {
    // Broadcast signaling data to everyone else in the room
    socket.to(roomId).emit("signal", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
