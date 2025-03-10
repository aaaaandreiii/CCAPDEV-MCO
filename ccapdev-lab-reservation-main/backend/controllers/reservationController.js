const mongoose = require('mongoose');
const ReservationByUser = require('../models/ReservationByUser');
const ReservationByLabTechnician = require('../models/ReservationByLabTechnician');

//fetch available slots for a lab on a specific day
exports.getAvailableSlots = async (req, res) => {
    try {
        const { labID, date } = req.params;

        //ensure labID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(labID)) {
            return res.status(400).json({ error: "Invalid labID format" });
        }
        const labObjectId = new mongoose.Types.ObjectId(labID);

        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);
        const now = new Date();
        const reservations = await ReservationByUser.find({
            labID: labObjectId,
            startTime: { $gte: startOfDay, $lt: endOfDay }
        });

        //generate 30-minute time slots (from 7:00AM - 6:00PM)
        const timeSlots = [];
        let startTime = new Date(startOfDay);
        startTime.setHours(7, 0, 0, 0);

        while (startTime.getHours() < 18) {
            const endTime = new Date(startTime.getTime() + 30 * 60000);

            //skip past time slots (only allow future slots)
            if (startTime < now) {
                startTime = endTime; //move to next slot
                continue;
            }

            //check if the slot is taken
            const isTaken = reservations.some(res =>
                (startTime >= res.startTime && startTime < res.endTime) ||
                (endTime > res.startTime && endTime <= res.endTime)
            );

            if (!isTaken) {
                timeSlots.push({ startTime: startTime.toISOString(), endTime: endTime.toISOString() });
            }
            startTime = endTime;
        }

        res.json(timeSlots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//fetch available seats for a lab at a specific time
exports.getAvailableSeats = async (req, res) => {
    try {
        const { labID, startTime } = req.params;
        const endTime = new Date(new Date(startTime).getTime() + 30 * 60000); //30 min slot

        const occupiedSeats = await ReservationByUser.find({
            labID,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        }, { seatNumber: 1 });

        const occupiedSeatNumbers = occupiedSeats.map(res => res.seatNumber);
        const totalSeats = 20; // some lab capacity AAAAAAAAA IDK
        const availableSeats = [];

        for (let i = 1; i <= totalSeats; i++) {
            if (!occupiedSeatNumbers.includes(i)) {
                availableSeats.push(i);
            }
        }

        res.json(availableSeats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//create a reservation for students
exports.reserveSlotByUser = async (req, res) => {
  try {
    const { userID, labID, startTime, endTime, seatNumber, isAnonymous } = req.body;
    
    const newReservation = new ReservationByUser({
      reservationID: new mongoose.Types.ObjectId(),
      userID,
      labID,
      startTime,
      endTime,
      seatNumber,
      isAnonymous
    });

    await newReservation.save();
    res.status(201).json({ message: 'Student reservation successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//create a reservation for lab technicians (walk-ins, maintenance)
exports.reserveSlotByTechnician = async (req, res) => {
  try {
    const { technicianID, labID, startTime, endTime, reason } = req.body;
    
    const newReservation = new ReservationByLabTechnician({
      reservationID: new mongoose.Types.ObjectId(),
      labID,
      startTime,
      endTime,
      reason,
      technicianID
    });

    await newReservation.save();
    res.status(201).json({ message: 'Technician reservation successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//fetch all student reservations
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await ReservationByUser.find().populate('userID', 'email').populate('labID', 'name');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//fetch all technician reservations
exports.getTechnicianReservations = async (req, res) => {
  try {
    const reservations = await ReservationByLabTechnician.find().populate('technicianID', 'email').populate('labID', 'name');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//remove a student reservation
exports.removeUserReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    await ReservationByUser.findByIdAndDelete(reservationId);
    res.json({ message: 'Student reservation removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//remove a technician reservation
exports.removeTechnicianReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    await ReservationByLabTechnician.findByIdAndDelete(reservationId);
    res.json({ message: 'Technician reservation removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
