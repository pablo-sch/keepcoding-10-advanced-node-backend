import { Server } from "socket.io";
import * as sessionManager from "./lib/sessionManager.js";

export let io;

export function setupWebSocketServer(httpServer) {
  io = new Server(httpServer);

  io.engine.use(sessionManager.middleware);

  io.on("connection", (socket) => {
    console.log("SOCKET.IO: New Connection of a Customer with ID", socket.id);

    const sessionId = socket.request.session.id;

    // create a chat room with the sessionId
    socket.join(sessionId);

    socket.on("chat-message", (payload) => {
      console.log(`Message Received From Client ID: ${socket.id} and Text: "${payload}"`);
      io.emit("chat-message", payload);
    });
  });
}
