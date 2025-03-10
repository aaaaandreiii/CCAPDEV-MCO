const mongoose = require('mongoose');

const reservationByUserSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  labID: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  seatNumber: Number,
  isAnonymous: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReservationByUser', reservationByUserSchema, 'ReservationsByUser');
