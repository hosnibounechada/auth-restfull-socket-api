import { body, oneOf } from "express-validator";

const firstName = body("firstName").toLowerCase().isLength({ min: 1, max: 25 }).withMessage("Invalid first name");
const lastName = body("lastName").toLowerCase().isLength({ min: 1, max: 25 }).withMessage("Invalid last name");
const username = body("username").isLength({ min: 6, max: 25 }).withMessage("Invalid username");
const notUsername = body("username").not().exists().withMessage("Invalid Input");
const email = body("email").isEmail().normalizeEmail().withMessage("Invalid E-mail");
const notEmail = body("email").not().exists().withMessage("Invalid Input");
const phone = body("phone").isMobilePhone("any").withMessage("Invalid phone number");
const notPhone = body("phone").not().exists().withMessage("Invalid Input");
const password = body("password").notEmpty().isLength({ min: 6, max: 50 }).withMessage("Invalid password");
const oldPassword = body("oldPassword").notEmpty().isLength({ min: 6, max: 50 }).withMessage("Invalid password");
const notLocal = body("local").not().exists().withMessage("Invalid Input");
const notGoogle = body("google").not().exists().withMessage("Invalid Input");
const code = body("code").isNumeric().isLength({ min: 4, max: 4 }).withMessage("Invalid code");
const phoneCode = body("code").isLength({ min: 6, max: 6 }).withMessage("Invalid code");

export const registerValidator = [firstName, lastName, email, password];

export const loginValidator = [
  oneOf(
    [
      [email, password, notUsername],
      [username, password, notEmail],
    ],
    "Invalid Credentials"
  ),
];

export const updateUserValidator = [firstName.optional(), lastName.optional(), notUsername, notEmail, notPhone, notLocal, notGoogle];

export const updatePasswordValidator = [oldPassword, password];

export const usernameValidator = [username];

export const emailValidator = [email];

export const phoneValidator = [phone];

export const existenceValidator = [oneOf([[email], [username], [phone]], "Invalid input")];

export const updateEmailValidator = [email, code];

export const sendEmailCodeValidator = [email, password];

export const confirmPhoneValidator = [phone, phoneCode];

export const resetPasswordValidator = [email, password, code];
