const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Name, email and password are required" });
    }
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'Community'
    });

    await user.save();
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ msg: "Registration failed" });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ msg: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    console.log('Login successful for:', email);
    res.json(userData);
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: "Login failed" });
  }
});

// Get Leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'Admin' } }).sort({ points: -1 }).limit(10).select('name points email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch leaderboard" });
  }
});

module.exports = router;