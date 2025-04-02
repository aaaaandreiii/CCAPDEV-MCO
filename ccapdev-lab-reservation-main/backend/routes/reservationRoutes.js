const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const { authenticateUser } = require("../middleware/authMiddleware");

router.get("/:labID", reservationController.getReservationsByLab);
router.post("/", authenticateUser, reservationController.createReservation);
router.get("/", authenticateUser, reservationController.getAllReservations);
router.post("/reserve", authenticateUser, reservationController.createReservation);
router.delete("/:reservationID", authenticateUser, reservationController.removeUserReservation);

module.exports = router;
