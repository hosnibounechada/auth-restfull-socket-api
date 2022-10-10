import { CustomError } from "./custom-error";

export class GoneError extends CustomError {
  statusCode = 410;

  constructor() {
    super("Gone");
    Object.setPrototypeOf(this, GoneError.prototype);
  }

  serializeErrors() {
    return [{ message: "Resource no longer exists" }];
  }
}
