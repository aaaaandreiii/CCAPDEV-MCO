const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config(); 

exports.register = async (req, res) => {
    const { email, password, confirmPassword, role } = req.body;  

    if (password !== confirmPassword) {
        console.log("passed password:", password);
        console.log("passed confirm password:", confirmPassword);
        return res.status(400).json({ message: "❌ Passwords do not match" });
    }

    try {
        console.log("Checking for existing email:", email);
        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
        console.log("User found?", existingUser);

        if (existingUser) {
            console.log("User already exists, rejecting request.");
            return res.status(400).json({ message: "Email has been registered already" });
        }

        console.log("Proceeding with registration...");

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userRole = role || "student";

        const newUser = new User({ email, password: hashedPassword, role: userRole });

        await newUser.save();
        console.log("✅ User registered successfully!");

        return res.status(201).json({ success: true, message: "✅ Registration successful!" });
    } catch (error) {
        console.error("❌ Registration failed:", error.message);
        return res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

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