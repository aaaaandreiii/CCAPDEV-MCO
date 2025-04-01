const express = require("express");
const router = express.Router();
const { updateUserProfile } = require("../controllers/userController");
const { hashId } = require("../utils/hashUtils");
const User = require("../models/User");
const { validateProfileUpdate } = require("../middleware/validateInputs");

router.put("/profile/:hashedId", validateProfileUpdate, updateUserProfile);

router.get("/profile/:hashedId", async (req, res) => {
    try {
        const matchedUser = await User.findOne();
        if (!matchedUser || hashId(matchedUser.id) !== req.params.hashedId) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ id: req.params.hashedId, name: matchedUser.name, email: matchedUser.email });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
