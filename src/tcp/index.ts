import { Server, Socket } from "socket.io";
import { authenticationMiddleware } from "./middleware";
import { EVENTS } from "./types";
import { registerMessagesHandler } from "./handlers";
import { registerAuthHandler } from "./handlers/auth";

const initialize = (io: Server) => {
  // authentication middleware to decide whether establish connection
  // with incoming sockets or not.
  io.use(authenticationMiddleware);

  io.on(EVENTS.CONNECTION, (socket: Socket) => {
    // Register all event handlers separately for easier and clean developing
    registerAuthHandler(io, socket);
    registerMessagesHandler(io, socket);
  });
};

export default initialize;
