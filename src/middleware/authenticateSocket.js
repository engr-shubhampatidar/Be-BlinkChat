// server/middleware/authenticateSocket.js

const authenticateSocket = (socket, next) => {
  // Perform authentication logic here
  const token = socket.handshake.auth.token;
  // Validate token and extract user ID

  if (userId) {
    // User is authenticated, allow joining the room
    socket.userId = userId; // Store user ID in socket object
    next();
  } else {
    // User is not authenticated, reject joining the room
    next(new Error("Unauthorized"));
  }
};

module.exports = authenticateSocket;
