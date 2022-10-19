import { RequestValidator } from "../middlewares";
import express from "express";
import { idValidator, sendMessageValidator, updateMessageValidator } from "../validators/message";
import { getMessage, removeMessage, sendMessage, updateMessage } from "../controllers/message";

const router = express.Router();

router.post("/", sendMessageValidator, RequestValidator, sendMessage);
router.get("/:id", idValidator("id"), RequestValidator, getMessage);
router.put("/:id", updateMessageValidator, RequestValidator, updateMessage);
router.delete("/:id", idValidator("id"), RequestValidator, removeMessage);

export default router;
