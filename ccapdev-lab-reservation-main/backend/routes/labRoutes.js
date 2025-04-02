const express = require('express');
const router = express.Router();
const Lab = require('../models/Lab');
const { getAllLabs, getLabById } = require('../controllers/LabController');

router.get('/', getAllLabs);
router.get('/:labID', getLabById);

router.get('/available-slots/:labId/:date', async (req, res) => {
    try {
        const { labId, date } = req.params;
        const selectedDate = new Date(date);
        const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

        const lab = await Lab.findById(labId);
        if (!lab) return res.status(404).json({ message: "Lab not found" });

        console.log(`✅ Found Lab: ${lab.name}`);
        console.log(`📝 Stored Availability:`, lab.unavailableSlots);

        if (!lab.unavailableSlots) {
            console.warn("⚠️ No unavailableSlots field in this lab document!");
            return res.status(400).json({ error: "Lab availability data is missing" });
        }

        const unavailable = lab.unavailableSlots.find(slot => slot.day === dayName);

        const workingHours = [
            { startTime: new Date(date + "T08:00:00"), endTime: new Date(date + "T10:00:00") },
            { startTime: new Date(date + "T10:00:00"), endTime: new Date(date + "T12:00:00") },
            { startTime: new Date(date + "T12:00:00"), endTime: new Date(date + "T14:00:00") },
            { startTime: new Date(date + "T14:00:00"), endTime: new Date(date + "T16:00:00") },
            { startTime: new Date(date + "T16:00:00"), endTime: new Date(date + "T18:00:00") }
        ];

        const availableSlots = workingHours.filter(slot => {
            if (!unavailable) return true;
            return !unavailable.slots.some(reserved =>
                (slot.startTime >= reserved.startTime && slot.startTime < reserved.endTime) ||
                (slot.endTime > reserved.startTime && slot.endTime <= reserved.endTime) ||
                (slot.startTime <= reserved.startTime && slot.endTime >= reserved.endTime)
            );
        });

        return res.status(200).json(availableSlots);
    } catch (error) {
        console.error("❌ Error fetching slots:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

module.exports = router;