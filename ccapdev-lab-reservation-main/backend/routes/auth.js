const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  console.log("Received:", req.body); // 🔍 Debug incoming request
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ message: '❌ Email has already been registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    
    console.log("🔥 Final check - About to save user:", newUser);

    await newUser.save()
      .then(() => console.log("User saved successfully:", newUser))  // Confirm user is saved
      .catch(err => console.error("Error saving user:", err));       // Log save errors

    res.status(201).json({ 
      success: true, 
      message: '✅ Registration successful! Welcome aboard!' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      'secretkey', 
      { expiresIn: '3w' }  // Shorter token expiration for better security
    );

    // Return user info along with token
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        role: user.role,
        name: `${user.firstName} ${user.lastName}`,  // Combined name field
        email: user.email
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout route (clears the token client-side)
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;