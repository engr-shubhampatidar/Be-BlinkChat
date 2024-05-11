const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authenticateToken = require("../middleware/auth");
// const { addToBlacklist } = require("../utils/blackListManager");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Login API endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(400).send("Invalid email or password");
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res
      .header("Authorization", token)
      .status(200)
      .send({ token, ...user });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

// Logout API endpoint
router.get("/logout", function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    // addToBlacklist(token);
    res.send("Logout successful");
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Protected route
router.get("/profile/:id", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });

    if (!user) return res.status(404).send("No such user");
    res.status(200).send({ user });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Upload profile image
router.post("/upload/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming authenticated user's ID is available in req.user
    const imageUrl = req.body.imageUrl; // Assuming image URL is sent in the request body

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's profile image URL
    user.url = imageUrl;
    await user.save();

    return res
      .status(200)
      .json({ message: "Profile image uploaded successfully", user: user });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// all users
router.get("/all", async (req, res) => {
  try {
    const user = await User.find({});

    if (!user) return res.status(404).send("No such user");
    res.status(200).send({ user });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// find users by name string
router.get("/search", async (req, res) => {
  try {
    // Get the name string from the query parameters
    const nameString = req.query.name;

    // Construct a regular expression to search for users whose names contain the specified string
    const regex = new RegExp(nameString, "i"); // 'i' flag for case-insensitive search

    // Find users whose names match the regular expression
    const users = await User.find({ name: { $regex: regex } });

    if (!users.length) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send({ users });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
