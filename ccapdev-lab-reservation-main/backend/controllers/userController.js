const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const { hashId, verifyHashedId } = require("../utils/hashUtils");
const userId = verifyHashedId(req.params.hashedId);


exports.updateUserProfile = async (req, res) => {
    // Validate inputs
    await check("name", "Name is required").notEmpty().run(req);
    await check("email", "Please include a valid email").isEmail().run(req);
    await check("password", "Password must be at least 6 characters")
        .optional()
        .isLength({ min: 6 })
        .run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = verifyHashedId(req.params.id);
        if (!userId) return res.status(400).json({ message: "Invalid user ID" });

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(12);
            user.password = await bcrypt.hash(req.body.password, salt);
        }        

        await user.save();
        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        const userId = await verifyHashedId(req.params.hashedId);
        if (!userId) return res.status(404).json({ message: "User not found" });

        const user = await User.findById(userId).select("-password"); //do not include password in get()
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        await User.deleteOne({ _id: user.id });
        io.emit("user-deleted", user.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};