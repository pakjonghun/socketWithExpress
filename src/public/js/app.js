const socket = new WebSocket(`ws://${window.location.host}`);

const form = document.getElementById("form");
const input = document.getElementById("input");
const ul = document.getElementById("ul");
const nickForm = document.getElementById("nickForm");
const nickInput = document.getElementById("nickInput");

nickForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = nickInput.value;
  socket.send(JSON.stringify({ type: "nickname", payload: value }));
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value;
  socket.send(JSON.stringify({ type: "message", payload: value }));
});

socket.addEventListener("open", (s) => {
  console.log("opened");
});

socket.addEventListener("message", (s) => {
  const li = document.createElement("li");
  li.innerText = s.data;
  ul.prepend(li);
});

socket.addEventListener("close", () => {
  console.log("closed");
});
