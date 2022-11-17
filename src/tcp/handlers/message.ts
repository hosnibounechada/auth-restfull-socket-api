import { Server, Socket } from "socket.io";
import { EVENTS, MessageType } from "../types";
import { messageSchema } from "../validators";
import { DataValidator } from "../services";
import { sendMessage } from "../controllers/message";

export const registerMessagesHandler = (io: Server, socket: Socket) => {
  io.on("test", (data) => {
    console.log("data:", data);
  });

  socket.on(EVENTS.MESSAGE_TO_SERVER, async (data: MessageType, callback: CallableFunction) => {
    if (!DataValidator.isValid(messageSchema, data)) return;

    console.log("from client", socket.handshake.headers.user, ":", data);

    const message = await sendMessage(data);

    if (!message) return callback({ status: false });

    callback({ status: true, message });

    io.to(message.to.toString()).emit(EVENTS.MESSAGE_TO_CLIENT, message);
  });
};
