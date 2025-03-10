const express = require('express');
const router = express.Router();

const Slot = require('../models/Slot');
const User = require('../models/User');


/*// ➤ View Available Slots
router.get('/slots', async (req, res) => {
  try {
    const slots = await Slot.find({ available: true }); // only available ones
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching slots', error: err });
  }
}); */

// ➤ Register a New User
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email has been registered already' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ➤ Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({ message: 'Login success', user });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
});

// ➤ Import Auth Routes Properly
const authRoutes = require('./auth');
router.use('/auth', authRoutes); // This ensures `api/auth/login` works

module.exports = router;