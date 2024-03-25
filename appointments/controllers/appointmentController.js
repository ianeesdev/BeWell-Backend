const asyncHandler = require("express-async-handler");
const Appointment = require("../models/appointmentModel");
const Therapist = require("../models/therapistModel");

// Function to fetch both upcoming and history appointments
const fetchAppointments = async (userId) => {
  const upcomingAppointments = await Appointment.find({
    userId,
    dateTime: { $gte: new Date() } // Find appointments with dateTime greater than or equal to current date
  }).populate('therapistId');

  const historyAppointments = await Appointment.find({
    userId,
    dateTime: { $lt: new Date() } // Find appointments with dateTime less than current date
  }).populate('therapistId');

  return { upcoming: upcomingAppointments, history: historyAppointments };
};

// @desc    Add new appointment and get all appointments
// @route   POST /appointments/add/:userId
// @access  Private
const addAppointment = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { therapistId, dateTime } = req.body;

  const appointment = await Appointment.create({
    userId,
    therapistId,
    dateTime
  });

  const appointments = await fetchAppointments(userId);

  res.status(201).json({ data: appointments });
});

// @desc    Get upcoming and history appointments
// @route   GET /appointments/:userId
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const appointments = await fetchAppointments(userId);

  res.status(200).json({ data: appointments });
});

module.exports = {
  addAppointment,
  getAppointments
};
