import { param } from "express-validator";

export const idValidator = (input: string) => {
  return [param(input).isMongoId().withMessage("Invalid inputs")];
};
