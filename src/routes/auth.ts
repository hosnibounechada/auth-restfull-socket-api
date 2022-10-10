import express, { Router } from "express";
import multer from "multer";
import {
  register,
  verifyEmail,
  login,
  getCurrentUser,
  updateUser,
  updateUserPassword,
  checkExistence,
  updateUsername,
  sendEmailCode,
  updateEmail,
  sendPhoneSMS,
  confirmPhone,
  forgotPasswordCode,
  confirmPasswordCode,
  deleteAccount,
  uploadProfilePicture,
  removeProfilePicture,
  getNewAccessToken,
  logOut,
} from "../controllers/auth";
import { RequestValidator, requireAuth, decodeRefreshToken } from "../middlewares";
import {
  registerValidator,
  loginValidator,
  existenceValidator,
  usernameValidator,
  updatePasswordValidator,
  sendEmailCodeValidator,
  updateEmailValidator,
  phoneValidator,
  confirmPhoneValidator,
  emailValidator,
  resetPasswordValidator,
} from "../validators/auth";

const router = express.Router();
const upload = multer();

router.post("/register", registerValidator, RequestValidator, register);

router.post("/login", loginValidator, RequestValidator, login);

router.post("/verifyEmail", verifyEmail);

router.get("/me", getCurrentUser);

router.get("/refresh", decodeRefreshToken, requireAuth, getNewAccessToken);

router.put("/update/:id", requireAuth, updateUser);

router.put("/updatePassword", requireAuth, updatePasswordValidator, updateUserPassword);

router.post("/checkExistence", existenceValidator, RequestValidator, checkExistence);

router.put("/updateUsername", requireAuth, usernameValidator, RequestValidator, updateUsername);

router.post("/sendEmailCode", requireAuth, sendEmailCodeValidator, RequestValidator, sendEmailCode);

router.put("/updateEmail", requireAuth, updateEmailValidator, RequestValidator, updateEmail);

router.post("/sendPhoneCode", requireAuth, phoneValidator, RequestValidator, sendPhoneSMS);

router.post("/confirmPhoneCode", requireAuth, confirmPhoneValidator, RequestValidator, confirmPhone);

router.post("/forgotPasswordViaRedis", emailValidator, RequestValidator, forgotPasswordCode);

router.post("/resetPasswordViaRedis", resetPasswordValidator, RequestValidator, confirmPasswordCode);

router.post("/uploadProfilePicture", requireAuth, upload.single("file"), uploadProfilePicture);

router.get("/removeProfilePicture", requireAuth, removeProfilePicture);

router.get("/logout", requireAuth, logOut);

router.delete("/", requireAuth, deleteAccount);

export default router;
