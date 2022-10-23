import express from "express";
import {
  sendRequest,
  acceptRequest,
  rejectRequest,
  unfriendUser,
  blockUser,
  unblockUser,
  reportUser,
  getUserById,
  getUsersByDisplayName,
  getFriendsMessages,
  getOnlineFriends,
  getSentRequests,
  getReceivedInvitations,
  getFriends,
  getBlockedUsers,
  unSendRequest,
} from "../controllers/user";
import { RequestValidator } from "../middlewares";
import { idValidator } from "../validators/user";

const router = express.Router();

router.get("/", getUsersByDisplayName);
router.get("/:id", idValidator("id"), RequestValidator, getUserById);
router.get("/sendRequest/:to", idValidator("to"), RequestValidator, sendRequest);
router.get("/unSendRequest/:to", idValidator("to"), RequestValidator, unSendRequest);
router.get("/acceptRequest/:from", idValidator("from"), RequestValidator, acceptRequest);
router.get("/rejectRequest/:from", idValidator("from"), RequestValidator, rejectRequest);
router.get("/unfriendUser/:userId", idValidator("userId"), RequestValidator, unfriendUser);
router.get("/blockUser/:userId", idValidator("userId"), RequestValidator, blockUser);
router.get("/unblockUser/:userId", idValidator("userId"), RequestValidator, unblockUser);
router.post("/reportUser/:userId", idValidator("userId"), RequestValidator, reportUser);
router.get("/messages/friendsMessages", getFriendsMessages);
router.get("/friends/online", getOnlineFriends);

router.get("/allFriends/get", getFriends);
router.get("/requests/get", getSentRequests);
router.get("/invitations/get", getReceivedInvitations);
router.get("/blocked/get", getBlockedUsers);

export default router;
