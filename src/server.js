import http from "http";
import express from "express";
import { resolve } from "path";
import WebSocket from "ws";

const app = express();

app.use("/public", express.static(resolve(__dirname, "public")));
app.set("view engine", "pug");
app.set("views", resolve(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/*", (req, res) => res.redirect("/"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);

  socket.send("message from s");

  socket.on("close", () => {
    console.log("disconnected");
  });

  socket.on("message", (message) => {
    const json = JSON.parse(message);

    if (json.type == "nickname") {
      socket.id = json.payload;
      return;
    }

    if (json.type == "message") {
      sockets.forEach((s) => {
        s.send(`${socket.id || "anno"}:${json.payload}`);
      });
      return;
    }

    sockets.forEach((s) => s.send(parsed));
  });
});

server.listen(3000, () => console.log("start"));
