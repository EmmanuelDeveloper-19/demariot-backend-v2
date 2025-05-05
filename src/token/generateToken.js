require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};


/*
require("dotenv").config();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Get TOKEN_KEY from environment or generate one
const TOKEN_KEY = process.env.TOKEN_KEY || crypto.randomBytes(64).toString("hex");

// If TOKEN_KEY wasn't in environment, you might want to log a warning
if (!process.env.TOKEN_KEY) {
  console.warn("WARNING: TOKEN_KEY not found in environment variables. Using generated key.");
  console.warn("For production, set a permanent TOKEN_KEY in your .env file.");
}

module.exports.createSecretToken = (id) => {
  return jwt.sign({ id }, TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
*/