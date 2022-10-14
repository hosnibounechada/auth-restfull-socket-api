import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";

interface UserPayload {
  id: string;
  email: string;
}

export const authenticationMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
  //console.log("socket connection established!", socket.handshake.auth.token);

  // authentication using access token
  // if (!socket.handshake.auth.token) return next(new Error("not authorized"));
  // const accessToken = socket.handshake.auth.token;
  // try {
  //   const { id } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY!) as UserPayload;
  //   socket.handshake.headers.user = id;
  // } catch {
  //   return next(new Error("not authorized"));
  // }

  // authentication using refresh Token
  if (!socket.request.headers.cookie) return next(new Error("not authorized"));
  const refreshToken = socket.request.headers.cookie.split("=")[1];
  try {
    const { id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY!) as UserPayload;
    socket.handshake.headers.user = id;
  } catch {
    return next(new Error("not authorized"));
  }
  next();
};
