import { body, param } from "express-validator";

export const sendMessageValidator = [
  body("from").isMongoId().withMessage("Invalid Message"),
  body("to").isMongoId().withMessage("Invalid Message"),
  body("type")
    .matches(/\b(?:text|image)\b/)
    .withMessage("Invalid Message"),
  body("content").isLength({ min: 1, max: 500 }).withMessage("Invalid Message"),
];

export const updateMessageValidator = [
  param("id").isMongoId().withMessage("Invalid inputs"),
  body("type")
    .matches(/\b(?:text|image)\b/)
    .withMessage("Invalid Message"),
  body("content").isLength({ min: 1, max: 500 }).withMessage("Invalid Message"),
];

export const idValidator = (input: string) => {
  return [param(input).isMongoId().withMessage("Invalid inputs")];
};
