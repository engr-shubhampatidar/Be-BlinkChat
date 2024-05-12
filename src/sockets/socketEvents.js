// server/sockets/socketEvents.js

const Message = require("../models/Message");
// const authenticateSocket = require("../middleware/authenticateSocket");
// const extractUserId = require("../middleware/extractUserId");

module.exports = function (socketIo) {
  // socketIo.use((socket, next) => {
  //   extractUserId(socket.request, {}, (err) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     next();
  //   });
  // });

  socketIo.on("connection", (socket) => {
    console.log("New client connected");

    // Join a room based on user ID
    socket.on("joinRoom", (userId) => {
      console.log("New room joined" + userId);
      socket.join(userId);
    });

    // Listen for new messages
    socket.on("message", async (data) => {
      try {
        // Save message to the database
        // const message = new Message(data);
        // await message.save();

        console.log(data, "message saved");
        // Send the new message only to the recipient's room
        socketIo.to(data.receiver).emit("message", data);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
