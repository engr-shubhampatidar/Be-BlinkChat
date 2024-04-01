const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authenticateToken = require("../middleware/auth");
const { addToBlacklist } = require("../utils/blackListManager");

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
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password");
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res
      .header("Authorization", token)
      .status(200)
      .send({ token, id: user._id });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

// Logout API endpoint
router.get("/logout", function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    addToBlacklist(token);
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

module.exports = router;
