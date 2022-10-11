import express from "express";
import path from "path";
import "express-async-errors";
import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsConfig from "./config/cors-config";

import { createServer } from "http";
import { Server } from "socket.io";

import { authRouter } from "./routes";
import { currentUser, errorHandler } from "./middlewares";

const app = express();

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(cors(corsConfig));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());

app.use(currentUser);

app.use(authRouter);

app.use(errorHandler);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: corsConfig,
});

export { httpServer, io };
