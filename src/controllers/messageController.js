// server/controllers/messageController.js

const Message = require("../models/Message");

// Controller function to retrieve messages for a specific user
async function getUserMessages(req, res) {
  const { senderId, receiverId } = req.params;
  try {
    // const messages = await Message.find({
    //   sender: senderId,
    //   receiver: receiverId,
    // });

    // Find messages where sender is senderId and receiver is receiverId,
    // or where sender is receiverId and receiver is senderId
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller function to create a new message
async function createMessage(req, res) {
  const { sender, receiver, content } = req.body;
  const newMessage = new Message({ sender, receiver, content });
  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// controller function to delete a message
async function deleteUserMessage(req, res, next) {
  const { sender, receiver } = req.params;
  try {
    // Find and delete the message
    const message = await Message.findOneAndDelete({
      sender: sender,
      receiver: receiver,
    });

    // Check if message exists
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Message deleted successfully
    res.status(200).json({
      message: "Message deleted successfully",
      deletedMessage: message,
    });
  } catch (error) {
    // Error handling
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getUserMessages,
  createMessage,
  deleteUserMessage,
};
