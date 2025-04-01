const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config(); 

exports.register = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ message: '❌ Passwords do not match' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: '❌ Email already registered' });

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ success: true, message: '✅ Registration successful!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // const user = await User.findOne({ email, isDeleted: false });
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
        // const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '3w' }
          );          

        res.status(200).json({
          message: 'Login successful',
          user: { id: user._id, role: user.role, email: user.email },
          token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const { userId } = req.body;
        const deletedUser = await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        if (req.app.io) req.app.io.emit("user-deleted", userId);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
