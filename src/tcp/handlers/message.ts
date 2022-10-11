import { Server, Socket } from "socket.io";
import { EVENTS, Message } from "../types";
import { messageSchema } from "../validators";
import { DataValidator } from "../services";
import redis from "../../services/redis";

const client = redis.getRedisClient();

export const registerMessagesHandler = (io: Server, socket: Socket) => {
  io.on("test", (data) => {
    console.log("data:", data);
  });

  socket.on(EVENTS.MESSAGE_TO_SERVER, async (message: Message) => {
    //for more security reasons we can extract the user id from socket.handshake.auth.token
    if (!DataValidator.isValid(messageSchema, message)) return;
    console.log("from client", socket.handshake.headers.user, ":", message);
    // save message in persistent database before triggering the event
    //
    // send private message to particular user
    io.to(message.to).emit(EVENTS.MESSAGE_TO_CLIENT, message);
  });
};
