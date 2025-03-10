import express from "express";
import mongoose from "mongoose";
import UserInformation from "../models/User.js"; 
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mime from "mime-types";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads")); 
    },
    filename: function (req, file, cb) {
        const ext = mime.extension(file.mimetype) || "png"; 
        cb(null, `profile_${Date.now()}.${ext}`); 
    }
});
const upload = multer({ storage });

router.get("/:id", async (req, res) => {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
    }

    try {
        const user = await UserInformation.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/:id", upload.single("profilePicture"), async (req, res) => {
    console.log(`POST request received for updating ID: ${req.params.id}`);
    
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID format" });
    }

    try {
        const updateData = {
            description: req.body.description,
        };

        if (req.file) {
            updateData.profilePicture = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await UserInformation.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
