import express from "express";
import { sendRequest, acceptRequest, rejectRequest, unfriendUser, blockUser, unblockUser, reportUser } from "../controllers/friends";

const router = express.Router();

router.get("/sendRequest/:to", sendRequest);
router.get("/acceptRequest/:from", acceptRequest);
router.get("/rejectRequest/:from", rejectRequest);
router.get("/unfriendUser/:userId", unfriendUser);
router.get("/blockUser/:userId", blockUser);
router.get("/unblockUser/:userId", unblockUser);
router.get("/reportUser/:userId", reportUser);

export default router;
