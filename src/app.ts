import express from "express";
import path from "path";
import "express-async-errors";
import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import corsConfig from "./config/cors-config";

import { createServer } from "http";
import { Server } from "socket.io";

import { authRouter, messageRouter, userRouter } from "./routes";
import { currentUser, errorHandler, requireAuth } from "./middlewares";

const app = express();

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(cors(corsConfig));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1000,
  })
);

app.use(currentUser);

app.use("/auth", authRouter);
app.use("/users", requireAuth, userRouter);
app.use("/messages", requireAuth, messageRouter);

app.use(errorHandler);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: corsConfig,
});

export { httpServer, io };
