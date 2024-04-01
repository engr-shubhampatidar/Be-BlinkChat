// server/controllers/messageController.js

const Message = require("../models/Message");

// Controller function to retrieve messages for a specific user
async function getUserMessages(req, res) {
  const { senderId, receiverId } = req.params;
  try {
    const messages = await Message.find({
      sender: senderId,
      receiver: receiverId,
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

module.exports = {
  getUserMessages,
  createMessage,
};
