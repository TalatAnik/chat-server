const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Login endpoint (password serves as the token)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ token: password }); // Token is the password
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "username");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
