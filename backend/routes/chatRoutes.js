const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController");
const { authenticateToken } = require("../middleware/auth");
const { uploadChatAttachment } = require("../utils/fileUpload");


router.use(authenticateToken);


router.get("/appointment/:appointmentId", chatController.getChatRoom);
router.get("/rooms", chatController.getUserChatRooms);


router.get("/messages/:chatRoomId", chatController.getChatMessages);


router.post(
  "/messages/:chatRoomId",
  uploadChatAttachment.single("attachment"),
  chatController.sendMessage
);


router.get("/unread", chatController.getUnreadMessageCounts);

module.exports = router;