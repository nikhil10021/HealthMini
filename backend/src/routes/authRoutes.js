import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!['doctor', 'patient'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash, role });
    res.json({ message: 'User registered', username: user.username, role: user.role });
  } catch (err) {
    let errorMsg = 'Registration failed';
    if (err.code === 11000) errorMsg = 'Username already exists';
    res.status(400).json({ message: errorMsg });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  if (!['doctor', 'patient'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Secure cookie with httpOnly (You can add 'secure: true' in production)
    res.cookie('token', token, { httpOnly: true });

    res.json({
      message: 'Login successful',
      token,
      role: user.role,
      username: user.username, // send username for frontend
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// New endpoint: Get total number of registered doctors
router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'doctor' });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
