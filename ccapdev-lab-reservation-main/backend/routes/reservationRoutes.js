const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const authenticateUser = require("../middleware/authMiddleware");

// Ensure all required functions exist before using them
if (!reservationController.getAllReservations) {
  throw new Error("reservationController.getAllReservations is undefined");
}

router.get("/", authenticateUser, reservationController.getAllReservations);
router.post("/create", authenticateUser, reservationController.createReservation);
router.delete("/:id", authenticateUser, reservationController.deleteReservation);

module.exports = router;