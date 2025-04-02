const mongoose = require("mongoose");
const Reservation = require("../models/Reservation");
const Lab = require("../models/Lab");
const User = require("../models/User");

// Fetch reservations by lab ID
exports.getReservationsByLab = async (req, res) => {
    try {
        const { labID } = req.params;
        const reservations = await Reservation.find({ labID }).populate("userID", "name email");

        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reservations", error });
    }
};

// Create a new reservation
exports.createReservation = async (req, res) => {
    try {
        const { userID, labID, seatNumber, startTime, endTime, isAnonymous } = req.body;

        // Check if seat is available
        const existingReservation = await Reservation.findOne({ labID, seatNumber, startTime });
        if (existingReservation) {
            return res.status(400).json({ message: "Seat already reserved for this time slot" });
        }

        // Create reservation
        const newReservation = new Reservation({
            userID: isAnonymous ? null : userID,
            labID,
            seatNumber,
            startTime,
            endTime,
            isAnonymous,
            reservationDate: new Date()
        });

        await newReservation.save();
        res.status(201).json({ message: "Reservation successful", newReservation });
    } catch (error) {
        res.status(500).json({ message: "Error creating reservation", error });
    }
};

// Fetch all reservations
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().populate("labID");
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reservations" });
    }
};

// Get available seats
exports.getAvailableSeats = async (req, res) => {
    try {
        const { labID, startTime } = req.params;
        const endTime = new Date(new Date(startTime).getTime() + 30 * 60000);

        if (!mongoose.Types.ObjectId.isValid(labID)) {
            return res.status(400).json({ error: "Invalid labID format" });
        }

        const occupiedSeats = await Reservation.find(
            { labID, $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }] },
            { seatNumber: 1, _id: 0 }
        );

        const occupiedSeatNumbers = occupiedSeats.map((res) => res.seatNumber);
        const totalSeats = 30;
        const availableSeats = Array.from({ length: totalSeats }, (_, i) => i + 1).filter(
            (seat) => !occupiedSeatNumbers.includes(seat)
        );

        res.json(availableSeats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove reservation
exports.removeUserReservation = async (req, res) => {
    try {
        const { reservationID } = req.params;

        if (!mongoose.Types.ObjectId.isValid(reservationID)) {
            return res.status(400).json({ message: "Invalid Reservation ID format" });
        }

        const reservation = await Reservation.findById(reservationID);
        if (!reservation) return res.status(404).json({ message: "Reservation not found" });

        await Reservation.findByIdAndDelete(reservationID);

        res.json({ message: "Reservation deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
