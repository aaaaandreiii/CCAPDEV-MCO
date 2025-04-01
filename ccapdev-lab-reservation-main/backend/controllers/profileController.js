const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { validateProfileUpdate } = require('../middleware/validateInputs');
const { uploadProfilePicture } = require('../utils/uploadUtils');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        validateProfileUpdate(req, res, async () => {
            const updates = req.body;
            if (updates.password) {
                updates.password = await bcrypt.hash(updates.password, 10);
            }
            const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json({ message: "Profile updated successfully", user });
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
    try {
        const imageUrl = await uploadProfilePicture(req.file);
        if (!imageUrl) return res.status(400).json({ message: "Image upload failed" });
        
        const user = await User.findByIdAndUpdate(req.user.id, { profilePicture: imageUrl }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "Profile picture updated successfully", profilePicture: imageUrl });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// const User = require('../models/User');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const { verifyHashedId } = require("../utils/hashUtils");

// // Get User Profile
// exports.getUserProfile = async (req, res) => {
//     const { id } = req.params;

//     // Validate ObjectID format
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ message: "Invalid user ID format" });
//     }

//     try {
//         const user = await User.findById(id).select("-password"); // Exclude password
//         if (!user) return res.status(404).json({ message: "User not found" });

//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// };

// // Update User Profile
// exports.updateUserProfile = async (req, res) => {
//     const { id } = req.params;
//     const { name, email, password, description } = req.body;

//     // Validate ObjectID format
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ message: "Invalid user ID format" });
//     }

//     try {
//         const userId = verifyHashedId(req.user.id); // Ensure user is updating their own profile
//         if (userId !== id) {
//             return res.status(403).json({ message: "Unauthorized action" });
//         }

//         let updateData = { description };

//         // Update name and email if provided
//         if (name) updateData.name = name;
//         if (email) updateData.email = email;

//         // Hash password if provided
//         if (password) {
//             const salt = await bcrypt.genSalt(12);
//             updateData.password = await bcrypt.hash(password, salt);
//         }

//         // Handle profile picture upload
//         if (req.file) {
//             updateData.profilePicture = `/uploads/${req.file.filename}`;
//         }

//         // Find and update user
//         const updatedUser = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select("-password");

//         if (!updatedUser) return res.status(404).json({ message: "User not found" });

//         res.json({ message: "Profile updated successfully", user: updatedUser });
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// };
