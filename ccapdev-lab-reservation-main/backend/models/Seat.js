const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema({
    seatNumber: { type: String, required: true },
    labID: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true },
    isAvailable: { type: Boolean, required: true, default: true }
});

module.exports = mongoose.model("Seat", SeatSchema);