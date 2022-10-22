import { Server, Socket } from "socket.io";
import { EVENTS, MessageType } from "../types";
import { messageSchema } from "../validators";
import { DataValidator } from "../services";
import { sendMessage } from "../controllers/message";

export const registerMessagesHandler = (io: Server, socket: Socket) => {
  io.on("test", (data) => {
    console.log("data:", data);
  });

  socket.on(EVENTS.MESSAGE_TO_SERVER, async (data: MessageType) => {
    //for more security reasons we can extract the user id from socket.handshake.auth.token
    if (!DataValidator.isValid(messageSchema, data)) return;
    console.log("from client", socket.handshake.headers.user, ":", data);
    // save message in persistent database before triggering the event
    const message = await sendMessage(data);
    console.log(message);
    // send private message to particular user
    if (!message) return;
    io.to(message.from.toString()).emit(EVENTS.MESSAGE_TO_CLIENT, message);
    //socket.emit(EVENTS.MESSAGE_TO_CLIENT, message);
  });
};
