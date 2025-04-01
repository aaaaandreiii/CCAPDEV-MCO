const mongoose = require('mongoose');

const reservationByUserSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  labID: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  seatNumber: { type: Number, min: 1 },
  isAnonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

reservationByUserSchema.index({ userID: 1, labID: 1, startTime: 1 });
module.exports = mongoose.model('ReservationByUser', reservationByUserSchema, 'ReservationsByUser');