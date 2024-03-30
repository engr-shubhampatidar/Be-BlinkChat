const express = require("express");
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");

const PORT = process.env.PORT || 3000;
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB()
  .then(() => {
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Routes
app.use("/api/user", userRoutes);

// Route returning "Hello"
app.get("/", (req, res) => {
  res.send("Hello, from BlinkChat");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
