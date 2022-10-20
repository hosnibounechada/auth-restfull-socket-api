import { RequestValidator } from "../middlewares";
import express from "express";
import { getMessagesValidator, idValidator, sendMessageValidator, updateMessageValidator } from "../validators/message";
import { getMessage, getMessages, removeMessage, sendMessage, updateMessage } from "../controllers/message";

const router = express.Router();

router.post("/", sendMessageValidator, RequestValidator, sendMessage);
router.get("/:id", idValidator("id"), RequestValidator, getMessage);
router.put("/:id", updateMessageValidator, RequestValidator, updateMessage);
router.delete("/:id", idValidator("id"), RequestValidator, removeMessage);
router.get("/private/:id", getMessagesValidator, RequestValidator, getMessages);

export default router;
