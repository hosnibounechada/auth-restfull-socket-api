import express from "express";
import path from "path";
import "express-async-errors";
import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import { authRouter } from "./routes";
import { currentUser, errorHandler } from "./middlewares";

const app = express();

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());

app.use(currentUser);

app.use(authRouter);

app.use(errorHandler);
export default app;
