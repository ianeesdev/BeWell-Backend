const asyncHandler = require("express-async-handler");
const Appointment = require("../models/appointmentModel");
const Therapist = require("../models/therapistModel");

// @desc    Add new appointment
// @route   POST /appointments/add
// @access  Private
const addAppointment = asyncHandler(async (req, res) => {
  const { userId, therapistId, dateTime } = req.body;

  const appointment = await Appointment.create({
    userId,
    therapistId,
    dateTime
  });

  res.status(201).json({ success: true, data: appointment });
});

// @desc    Get upcoming appointments
// @route   GET /appointments/upcoming/:userId
// @access  Private
const getUpcomingAppointments = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const upcomingAppointments = await Appointment.find({
    userId,
    dateTime: { $gte: new Date() } // Find appointments with dateTime greater than or equal to current date
  }).populate('therapistId');

  res.json({ success: true, data: upcomingAppointments });
});

// @desc    Get history appointments
// @route   GET /appointments/history/:userId
// @access  Private
const getHistoryAppointments = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const historyAppointments = await Appointment.find({
    userId,
    dateTime: { $lt: new Date() } // Find appointments with dateTime less than current date
  }).populate('therapistId');

  res.json({ success: true, data: historyAppointments });
});

module.exports = {
  addAppointment,
  getUpcomingAppointments,
  getHistoryAppointments
};
