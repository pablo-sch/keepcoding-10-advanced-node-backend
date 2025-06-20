import http from "node:http";
import express from "express";
import path from "node:path";
import { setupWebSocketServer } from "./webSocketServer.js";

const app = express();

app.get("/", (req, res, next) => {
  res.sendFile(path.join(import.meta.dirname, "index.html"));
});

const server = http.createServer(app);

server.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});

setupWebSocketServer(server);
