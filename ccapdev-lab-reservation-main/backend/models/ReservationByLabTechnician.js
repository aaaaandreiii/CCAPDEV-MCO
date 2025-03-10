const mongoose = require('mongoose');

const reservationByLabTechnicianSchema = new mongoose.Schema({
  reservationID: { type: String, unique: true, required: true },
  labID: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  reason: { type: String, enum: ['Maintenance', 'Walk-in'], required: true },
  technicianID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReservationByLabTechnician', reservationByLabTechnicianSchema, 'ReservationsByLabTechnician');
