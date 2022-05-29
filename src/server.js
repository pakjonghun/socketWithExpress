import http from "http";
import express from "express";
import { resolve } from "path";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.use("/public", express.static(resolve(__dirname, "public")));
app.set("view engine", "pug");
app.set("views", resolve(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/*", (req, res) => res.redirect("/"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

// wss.on("connection", (socket) => {
//   sockets.push(socket);

//   socket.send("message from s");

//   socket.on("close", () => {
//     console.log("disconnected");
//   });

//   socket.on("message", (message) => {
//     const json = JSON.parse(message);

//     if (json.type == "nickname") {
//       socket.id = json.payload;
//       return;
//     }

//     if (json.type == "message") {
//       sockets.forEach((s) => {
//         s.send(`${socket.id || "anno"}:${json.payload}`);
//       });
//       return;
//     }

//     sockets.forEach((s) => s.send(parsed));
//   });
// });

// server.listen(3000, () => console.log("start"));

function getPublicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;

  const publicRooms = [];

  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) publicRooms.push(key);
  });

  return publicRooms;
}

function memberCount(room) {
  return io.sockets.adapter.rooms?.get(room).size;
}

io.on("connection", (socket) => {
  socket["nickname"] = "empty";
  socket.onAny((e) => {
    console.log(e);
  });

  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });

  socket.on("enterRoom", (roomName, cb) => {
    socket.join(roomName);
    const count = memberCount(roomName);
    cb(roomName, count);
    socket.to(roomName).emit("welcome", socket.nickname, count);
    io.sockets.emit("roomChange", getPublicRooms());
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      const count = memberCount(room);
      socket.to(room).emit("bye", socket.nickname, count - 1);
    });
  });

  socket.on("message", (curRoom, message, cb) => {
    socket.to(curRoom).emit("message", message, socket.nickname);
    cb(message, socket.nickname);
  });
});

server.listen(3000, () => {
  console.log("server is starting on 3000");
});
