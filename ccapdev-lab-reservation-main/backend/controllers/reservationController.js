const mongoose = require("mongoose");
const ReservationByUser = require("../models/ReservationByUser");
const ReservationByLabTechnician = require("../models/ReservationByLabTechnician");

// Function to get available slots (assuming it's needed)
const calculateAvailableSlots = async (startTime) => {
    // Implement logic to calculate available slots
    return []; // Placeholder, replace with actual implementation
};

exports.getAvailableSlots = async (req, res) => {
    try {
        const { startTime } = req.query;
        const parsedStartTime = new Date(startTime);
        if (isNaN(parsedStartTime)) {
            return res.status(400).json({ message: "Invalid startTime format" });
        }

        const slots = await calculateAvailableSlots(parsedStartTime);
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: "Error fetching available slots" });
    }
};

// ✅ Fixed: Ensured fetching all reservations correctly
exports.getAllReservations = async (req, res) => {
    try {
        const userReservations = await ReservationByUser.find().populate("labID");
        const technicianReservations = await ReservationByLabTechnician.find().populate("labID");

        res.json({ userReservations, technicianReservations });
    } catch (error) {
        res.status(500).json({ message: "Error fetching reservations" });
    }
};

// ✅ Fixed: Validate `labID`
exports.getAvailableSeats = async (req, res) => {
    try {
        const { labID, startTime } = req.params;
        const endTime = new Date(new Date(startTime).getTime() + 30 * 60000);

        if (!mongoose.Types.ObjectId.isValid(labID)) {
            return res.status(400).json({ error: "Invalid labID format" });
        }
        const labObjectId = new mongoose.Types.ObjectId(labID);

        const occupiedSeats = await ReservationByUser.find(
            { labID: labObjectId, $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }] },
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

// ✅ Fixed: WebSocket emits event properly
exports.reserveSlotByUser = async (req, res) => {
    try {
        const { userId, isAnonymous, labID, startTime, endTime, seatNumber } = req.body;

        const reservation = new ReservationByUser({
            userId: isAnonymous ? null : userId,
            anonymous: isAnonymous,
            labID,
            startTime,
            endTime,
            seatNumber,
        });

        await reservation.save();

        if (req.app.io) {
            req.app.io.emit("new-reservation", reservation);
        }

        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Fixed: Ensure reservationID consistency
exports.reserveSlotByTechnician = async (req, res) => {
    try {
        const { technicianID, labID, startTime, endTime, reason } = req.body;

        const newReservation = new ReservationByLabTechnician({
            technicianID,
            labID,
            startTime,
            endTime,
            reason,
        });

        await newReservation.save();
        res.status(201).json({ message: "Technician reservation successful" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ✅ Fixed: Validate `userID`
exports.getUserReservations = async (req, res) => {
    try {
        const { userID } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }

        const reservations = await ReservationByUser.find({ userId: userID }).populate("labID");

        res.json(
            reservations.map((res) => ({
                ...res._doc,
                name: res.userId ? res.userId.name : "Anonymous",
            }))
        );
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Fixed: Added error handling for technician reservations
exports.getTechnicianReservations = async (req, res) => {
    try {
        const reservations = await ReservationByLabTechnician.find()
            .populate("technicianID", "email")
            .populate("labID", "name");

        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Fixed: Properly delete user reservation
exports.removeUserReservation = async (req, res) => {
    try {
        const { reservationID } = req.params;
        if (!mongoose.Types.ObjectId.isValid(reservationID)) {
            return res.status(400).json({ message: "Invalid Reservation ID format" });
        }

        const reservation = await ReservationByUser.findById(reservationID);
        if (!reservation) return res.status(404).json({ message: "Reservation not found" });

        await ReservationByUser.findByIdAndDelete(reservationID);

        if (req.app.io && reservation.labID) {
            req.app.io.emit("reservationRemoved", { labID: reservation.labID, reservationID });
        }

        res.json({ message: "Reservation deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Fixed: Properly delete technician reservation
exports.removeTechnicianReservation = async (req, res) => {
    try {
        const { reservationID } = req.params;
        if (!mongoose.Types.ObjectId.isValid(reservationID)) {
            return res.status(400).json({ message: "Invalid Reservation ID format" });
        }

        const reservation = await ReservationByLabTechnician.findById(reservationID);
        if (!reservation) return res.status(404).json({ message: "Reservation not found" });

        await ReservationByLabTechnician.findByIdAndDelete(reservationID);

        res.json({ message: "Technician reservation removed" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
