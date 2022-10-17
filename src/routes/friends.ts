import express from "express";
import { sendRequest, acceptRequest, rejectRequest, unfriendUser, blockUser, unblockUser, reportUser } from "../controllers/friends";
import { RequestValidator } from "../middlewares";
import { idValidator } from "../validators/friends";

const router = express.Router();

router.get("/sendRequest/:to", idValidator("to"), RequestValidator, sendRequest);
router.get("/acceptRequest/:from", idValidator("from"), RequestValidator, acceptRequest);
router.get("/rejectRequest/:from", idValidator("from"), RequestValidator, rejectRequest);
router.get("/unfriendUser/:userId", idValidator("userId"), RequestValidator, unfriendUser);
router.get("/blockUser/:userId", idValidator("userId"), RequestValidator, blockUser);
router.get("/unblockUser/:userId", idValidator("userId"), RequestValidator, unblockUser);
router.get("/reportUser/:userId", idValidator("userId"), RequestValidator, reportUser);

export default router;
