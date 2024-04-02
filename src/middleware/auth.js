const jwt = require("jsonwebtoken");
const isTokenBlacklisted = require("../utils/blackListManager");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).send("Access denied");

  const token = authHeader.split(" ")[1]; // Extract token without "Bearer" prefix
  if (isTokenBlacklisted(token)) return res.status(401).send("Token revoked");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send("Invalid token");
  }
};

module.exports = authenticateToken;
