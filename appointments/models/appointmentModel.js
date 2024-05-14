const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  therapistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Therapist',
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  amount: Number
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
