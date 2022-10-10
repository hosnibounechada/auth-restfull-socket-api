import jwt from "jsonwebtoken";
import { UserPayload } from "../types";

export class JwtProvider {
  static jwtAuth(data: UserPayload, tokenKey: string, ttl: string) {
    return jwt.sign(data, tokenKey, {
      expiresIn: ttl,
    });
  }

  static async compare(storedPassword: string, suppliedPassword: string) {}
}
