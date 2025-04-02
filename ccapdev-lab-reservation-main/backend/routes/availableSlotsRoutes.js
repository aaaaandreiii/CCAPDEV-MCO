const express = require("express");
const router = express.Router();
const Lab = require("../models/Lab");
const Reservation = require("../models/Reservation");

// Function to generate time slots dynamically (30-minute intervals)
function generateTimeSlots(interval = 30) {
    const slots = [];
    let startTime = 7 * 60; // 07:00 in minutes
    let endTime = 18 * 60; // 18:00 in minutes

    while (startTime < endTime) {
        let hours = Math.floor(startTime / 60);
        let minutes = startTime % 60;
        let start = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        startTime += interval; // Add interval (30 mins)
        hours = Math.floor(startTime / 60);
        minutes = startTime % 60;
        let end = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        slots.push({ startTime: start, endTime: end });
    }

    return slots;
}

// Route to get available slots for a given lab and date
router.get("/api/available-slots/:labID/:date", async (req, res) => {
    try {
        const { labID, date } = req.params;

        // Check if the lab exists
        const lab = await Lab.findById(labID);
        if (!lab) {
            return res.status(404).json({ error: "Lab not found" });
        }

        // Generate all possible time slots
        let allSlots = generateTimeSlots();

        // Fetch reservations for this lab on the given date
        const reservations = await Reservation.find({ labID, reservationDate: date });

        // Remove booked slots
        const bookedSlots = reservations.map(res => ({
            startTime: res.startTime,
            endTime: res.endTime
        }));

        const availableSlots = allSlots.filter(slot =>
            !bookedSlots.some(booked => booked.startTime === slot.startTime && booked.endTime === slot.endTime)
        );

        res.json({ lab: lab.name, date, availableSlots });
    } catch (error) {
        console.error("Error fetching available slots:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

module.exports = router;