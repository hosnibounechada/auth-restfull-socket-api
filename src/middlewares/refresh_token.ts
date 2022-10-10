import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { NotAuthenticatedError, NotAuthorizedError } from "../errors";
import { UserPayload } from "../types";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const decodeRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies?.jwt) throw new NotAuthenticatedError();
  try {
    const payload = jwt.verify(req.cookies.jwt, process.env.REFRESH_TOKEN_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    res.clearCookie("jwt");
    throw new NotAuthenticatedError();
  }

  next();
};
