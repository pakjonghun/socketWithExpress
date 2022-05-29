const socket = io();
const room = document.getElementById("room");
const welcome = document.getElementById("welcome");
const nameForm = document.getElementById("nameForm");
const roomDiv = document.getElementById("rooms");

let curRoom = "";

window.onload = () => {
  room.hidden = true;
};

nameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = room.querySelector("#nameInput");
  socket.emit("nickname", nameInput.value);
});

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.prepend(li);
}

const roomInput = document.getElementById("roomInput");
const roomForm = document.getElementById("roomForm");

function makeRoomTitle(name, count) {
  const title = room.querySelector("h3");
  title.innerHTML = `${name}(${count})`;
}

function enterRoom(roomName, count) {
  room.hidden = false;
  welcome.hidden = true;
  makeRoomTitle(roomName, count);
  curRoom = roomName;
}

roomForm.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("enterRoom", roomInput.value, enterRoom);
  roomInput.value = "";
});

const messageInput = document.getElementById("messageInput");
const messageForm = document.getElementById("messageForm");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("message", curRoom, messageInput.value, (message, nickname) =>
    addMessage(`${nickname}(나):${message}`)
  );
  messageInput.value = "";
});

socket.on("welcome", (nickname, count) => {
  addMessage(`welcom ${nickname}`);
  makeRoomTitle(curRoom, count);
});

socket.on("bye", (nickname, count) => {
  addMessage(`${nickname} 접속이 끊기셨습니다.`);
  makeRoomTitle(curRoom, count);
});

socket.on("message", (message, nickname) => {
  addMessage(`${nickname}:${message}`);
});

socket.on("roomChange", (rooms) => {
  console.log(rooms);
  const lis = rooms.map((room) => `<li>${room}</li>`).join("");
  const roomUl = roomDiv.querySelector("ul");
  roomUl.innerHTML = lis;
});
