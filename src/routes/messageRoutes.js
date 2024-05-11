// server/routes/messageRoutes.js

const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// GET /api/messages/:senderId/:receiverId - Retrieve messages between specific sender and receiver
router.get("/:senderId/:receiverId", messageController.getUserMessages);

// DELETE /api/messages/:senderId/:receiverId - Delete messages between specific sender and receiver
router.delete("/:senderId/:receiverId", messageController.deleteUserMessage);

// POST /api/messages - Create a new message
router.post("/", messageController.createMessage);

module.exports = router;
