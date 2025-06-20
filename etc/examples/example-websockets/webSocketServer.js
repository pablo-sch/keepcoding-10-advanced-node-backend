import { Server } from "socket.io";

export function setupWebSocketServer(httpServer) {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("New connection of a customer with id", socket.id);

    socket.on("chat-message", (payload) => {
      console.log(`Message received from client id: ${socket.id} and text: "${payload}"`);
      io.emit("chat-message", payload);
    });
  });
}
