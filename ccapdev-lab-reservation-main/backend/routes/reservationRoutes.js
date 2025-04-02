const express = require("express");
const router = express.Router();
const Lab = require('../models/Lab'); 
const Reservation = require('../models/Reservation');
const reservationController = require("../controllers/reservationController");
const { authenticateUser } = require("../middleware/authMiddleware");
const generateTimeSlots = require('../utils/timeSlots');

router.get("/", authenticateUser, reservationController.getAllReservations);
router.get("/:labID", reservationController.getReservationsByLab);
router.post("/", authenticateUser, reservationController.createReservation);
// router.post("/reserve", authenticateUser, reservationController.createReservation);
router.delete("/:reservationID", authenticateUser, reservationController.removeUserReservation);

router.post('/api/book-slot', async (req, res) => {
    try {
        const { labId, date, startTime, endTime } = req.body;

        // Find lab
        const lab = await Lab.findById(labId);
        if (!lab) return res.status(404).json({ error: "Lab not found" });

        // Check if there's already a reservation for that date
        let reservation = lab.reservations.find(res => res.date === date);

        if (!reservation) {
            // If no reservation exists for the date, create a new one
            reservation = { date, slots: [] };
            lab.reservations.push(reservation);
        }

        // Check if the slot is already booked
        const isSlotTaken = reservation.slots.some(slot => 
            slot.startTime === startTime && slot.endTime === endTime
        );

        if (isSlotTaken) {
            return res.status(400).json({ error: "Slot already booked" });
        }

        // Add new booking
        reservation.slots.push({ startTime, endTime });

        // Save the lab with updated reservations
        await lab.save();

        res.json({ message: "Slot booked successfully", lab });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// router.post('/api/book-slot', async (req, res) => {
//     try {
//         const { labId, date, startTime, endTime } = req.body;

//         // Find lab
//         const lab = await Lab.findById(labId);
//         if (!lab) return res.status(404).json({ error: "Lab not found" });

//         // Check if there's already a reservation for that date
//         let reservation = lab.reservations.find(res => res.date === date);

//         if (!reservation) {
//             // If no reservation exists for the date, create a new one
//             reservation = { date, slots: [] };
//             lab.reservations.push(reservation);
//         }

//         // Check if the slot is already booked
//         const isSlotTaken = reservation.slots.some(slot => 
//             slot.startTime === startTime && slot.endTime === endTime
//         );

//         if (isSlotTaken) {
//             return res.status(400).json({ error: "Slot already booked" });
//         }

//         // Add new booking
//         reservation.slots.push({ startTime, endTime });

//         // Save the lab with updated reservations
//         await lab.save();

//         res.json({ message: "Slot booked successfully", lab });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
// });


module.exports = router;