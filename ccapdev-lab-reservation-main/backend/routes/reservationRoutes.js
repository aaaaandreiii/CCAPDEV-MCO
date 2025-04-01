const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const { authenticateUser } = require("../middleware/authMiddleware");

if (!reservationController.getAllReservations) {
  throw new Error("reservationController.getAllReservations is undefined");
}

router.get("/", authenticateUser, reservationController.getAllReservations);
router.post("/reserve", authenticateUser, reservationController.reserveSlotByUser);
router.delete("/:id", authenticateUser, reservationController.removeUserReservation);

module.exports = router;