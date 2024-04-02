const express = require("express");
const router = express.Router();

const {
  addAppointment,
  getAppointments,
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");

// Add new appointment
router.post("/add/:userId", addAppointment);

// Get all appointments
router.get("/:userId", getAppointments);

module.exports = router;
