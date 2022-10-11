const userToken = document.getElementById("userId");
const buttonConnect = document.getElementById("button-connect");
const messageInput = document.getElementById("message-input");
const messageTo = document.getElementById("message-input-to");
const buttonSend = document.getElementById("button-send");

const authTokens = ["abc", "acb", "bac", "bca", "cab", "cba"];
const index = Math.floor(Math.random() * 5);

token = authTokens[index];
userToken.innerHTML = token;

// var socket = io({ auth: { token: token } });
const socket = io({ autoConnect: false });

buttonSend.addEventListener("click", (e) => {
  e.preventDefault();
  socket.auth.token = token;
  socket.connect();
  // const message = { from: token, to: messageTo.value, message: messageInput.value };
  // console.log(message);
  // socket.emit("messageToServer", message);
});
/*
socket.on("statusNotification", (data) => {
  const message = data.status ? "has connected" : "has disconnected";
  console.log("user:", data.id, " / ", message);
});

socket.on("messageToClient", (data) => {
  // console.log("User ID:", socket.handshake.headers.user);
  console.log("data :", data);
});
*/
