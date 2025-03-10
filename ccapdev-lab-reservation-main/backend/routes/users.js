import express from "express";
import User from "../models/User.js"; 

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await User.find(); 
        if (!users.length) return res.status(404).json({ message: "No users found" });

        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
