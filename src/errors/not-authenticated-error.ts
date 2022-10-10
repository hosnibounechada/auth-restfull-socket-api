import { CustomError } from "./custom-error";

export class NotAuthenticatedError extends CustomError {
  statusCode = 422;

  constructor() {
    super("Not authenticated");
    Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not authenticated" }];
  }
}
