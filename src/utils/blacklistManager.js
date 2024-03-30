// blacklistUtils.js

const fs = require("fs");

const BLACKLIST_FILE = "blacklist.json";

// Function to add token to blacklist
const addToBlacklist = (token) => {
  try {
    const blacklist = getBlacklist();
    blacklist.push({ token, timestamp: Date.now() });
    updateBlacklist(blacklist);
    console.log("Token added to blacklist");
  } catch (error) {
    console.error("Error adding token to blacklist:", error);
  }
};

// Function to clean up blacklisted tokens
const cleanupBlacklist = () => {
  try {
    const blacklist = getBlacklist();
    const currentTime = Date.now();
    const updatedBlacklist = blacklist.filter((token) => {
      // Check if token has expired (e.g., 6 hours)
      return currentTime - token.timestamp <= 6 * 60 * 60 * 1000;
    });
    updateBlacklist(updatedBlacklist);
    console.log("Blacklist cleanup completed");
  } catch (error) {
    console.error("Error cleaning up blacklist:", error);
  }
};

// Function to get the current blacklist
const getBlacklist = () => {
  try {
    if (fs.existsSync(BLACKLIST_FILE)) {
      const blacklistData = fs.readFileSync(BLACKLIST_FILE, "utf8");
      return JSON.parse(blacklistData);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error reading blacklist file:", error);
    return [];
  }
};

// Function to update the blacklist file with new data
const updateBlacklist = (blacklist) => {
  try {
    fs.writeFileSync(BLACKLIST_FILE, JSON.stringify(blacklist, null, 2));
  } catch (error) {
    console.error("Error updating blacklist:", error);
  }
};

// Function to check if a token is blacklisted
const isTokenBlacklisted = (token) => {
  try {
    const blacklist = getBlacklist();
    return blacklist.some((entry) => entry.token === token);
  } catch (error) {
    console.error("Error checking blacklist:", error);
    return false;
  }
};

module.exports = { addToBlacklist, cleanupBlacklist, isTokenBlacklisted };
