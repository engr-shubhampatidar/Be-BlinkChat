const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const socketEvents = require("./src/sockets/socketEvents"); // Import socket events handler
const connectDB = require("./src/config/db"); // Import database connection setup
const userRoutes = require("./src/routes/userRoutes"); // Import user routes
const messageRoutes = require("./src/routes/messageRoutes"); // Import message routes

const PORT = process.env.PORT || 3000;
const CLIENT = process.env.CLIENT_URL;
console.log(`Port ${PORT}`);
console.log(`Client ${CLIENT}`);
require("dotenv").config();

// Middleware
app.options("*", cors());
app.use(
  cors({
    origin: [
      "https://be-blink-chat.vercel.app",
      "https://fe-blink-chat.vercel.app",
      `${CLIENT}`,
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB
connectDB()
  .then(() => {
    // Start HTTP server
    const server = http.createServer(app);

    // Socket.IO setup
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    // Attach socket event handlers
    socketEvents(io);

    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Routes
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);

// Route returning "Hello"
app.get("/", (req, res) => {
  res.send("Hello, from BlinkChat");
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    // Handle Mongoose validation errors
    return res.status(400).json({ message: err.message });
  } else if (err.name === "UnauthorizedError") {
    // Handle JWT authentication errors
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    // Handle other errors
    console.error(err.stack);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

