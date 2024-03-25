const express = require("express");
const router = express.Router();

const {
  addAppointment,
  getUpcomingAppointments,
  getHistoryAppointments
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");

// Add new appointment
router.post("/add", addAppointment);

// Get upcoming appointments
router.get("/upcoming/:userId", getUpcomingAppointments);

// Get history appointments
router.get("/history/:userId", getHistoryAppointments);

module.exports = router;
