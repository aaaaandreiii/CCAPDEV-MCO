const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    labID: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true },
    seatNumber: { type: String, required: true },
    startTime: { type: String, required: true }, // e.g., "07:00"
    endTime: { type: String, required: true },   // e.g., "07:30"
    reservationDate: { type: String, required: true } // Format: "YYYY-MM-DD"
});

module.exports = mongoose.model("Reservation", ReservationSchema);