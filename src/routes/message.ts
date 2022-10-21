import express from "express";
import { RequestValidator } from "../middlewares";
import { idValidator, sendMessageValidator, updateMessageValidator } from "../validators/message";
import { deleteConversation, getMessage, getMessages, markAsViewed, removeMessage, sendMessage, updateMessage } from "../controllers/message";

const router = express.Router();

router.get("/:id", idValidator("id"), RequestValidator, getMessage);
router.post("/", sendMessageValidator, RequestValidator, sendMessage);
router.delete("/:id", idValidator("id"), RequestValidator, removeMessage);
router.put("/:id", updateMessageValidator, RequestValidator, updateMessage);
router.get("/private/:userId", idValidator("userId"), RequestValidator, getMessages);
router.get("/markAsViewed/:userId", idValidator("userId"), RequestValidator, markAsViewed);
router.delete("/conversation/:userId", idValidator("userId"), RequestValidator, deleteConversation);

export default router;
