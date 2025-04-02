const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;  // Import ObjectId

const Seat = require("../models/Seat");

router.get("/:labID/:timeSlot", async (req, res) => {
    try {
        const { labID, timeSlot } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(labID)) {
            console.error("❌ Invalid labID:", labID);
            return res.status(400).json({ error: "Invalid labID format" });
        }

        console.log("🔍 Fetching seats for lab:", labID, "at", timeSlot);

        // const availableSeats = await Seat.find({ labID: new mongoose.Types.ObjectId(labID), isAvailable: true });
        const availableSeats = await Seat.find({ labID: new ObjectId(labID), isAvailable: true });


        console.log("✅ Available Seats:", availableSeats);
        res.json(availableSeats);
    } catch (error) {
        console.error("❌ Error fetching seats:", error);
        res.status(500).json({ error: "Failed to fetch seats" });
    }
});

module.exports = router;
