import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../types";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) return next();

  const token = req.headers.authorization.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  next();
};
