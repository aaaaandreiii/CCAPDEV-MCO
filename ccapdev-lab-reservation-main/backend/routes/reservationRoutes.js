const express = require('express');
const {
  reserveSlotByUser,
  reserveSlotByTechnician,
  getUserReservations,
  getTechnicianReservations,
  removeUserReservation,
  removeTechnicianReservation,
  getAvailableSlots, 
  getAvailableSeats
} = require('../controllers/reservationController');

const router = express.Router();

//reservation availability
router.get('/available-slots/:labID/:date', getAvailableSlots);
router.get('/seats/:labID/:startTime', getAvailableSeats);

//student reservations
router.post('/reserve/user', reserveSlotByUser);
router.get('/reservations/user', getUserReservations);
router.delete('/remove-reservation/user/:reservationId', removeUserReservation);

//lab technician reservations
router.post('/reserve/technician', reserveSlotByTechnician);
router.get('/reservations/technician', getTechnicianReservations);
router.delete('/remove-reservation/technician/:reservationId', removeTechnicianReservation);

module.exports = router;
