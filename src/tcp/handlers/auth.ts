import { Server, Socket } from "socket.io";
import { EVENTS } from "../types";
import { addUser, getUsers, removeUser, friends } from "../utils/user";
import redis from "../../services/redis";

const client = redis.getRedisClient();

export const registerAuthHandler = (io: Server, socket: Socket) => {
  // socket connection will be dropped/closed by the server in case user try to alter it.
  // will be changed if found better solution
  const userId = socket.handshake.headers.user as string;

  console.log("user :", userId, " / socket ID :", socket.id, " / has connected");

  const userJoin = async () => {
    console.log(`id:${userId};`);
    socket.join(userId);
    // get friends from Redis instead of memory
    //socket.join(friends[userId]);
    // will be removed and store connection status in Redis instead
    addUser({ userId: userId, socketId: socket.id });
    await client.sAdd("online", userId);
    // send proper status notification.
    const notification = { id: userId, status: true };
    // broadcast the event to all subscribers
    socket.to(userId).emit("statusNotification", notification);
    //only for debugging purposes
    console.log(getUsers());
  };

  const userLeave = async () => {
    console.log("user :", userId, " / socket ID :", socket.id, " / has been disconnected");
    // will be removed later
    removeUser(socket.id);
    await client.sRem("online", userId);

    socket.leave(userId);
    // will be updated to proper notification
    const notification = { id: userId, status: false };
    // broadcast the event to all subscribers
    socket.to(userId).emit("statusNotification", notification);
    // for debugging purposes
    console.log(getUsers());
  };

  userJoin();
  socket.on(EVENTS.DISCONNECT, userLeave);
};
