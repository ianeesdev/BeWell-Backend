const asyncHandler = require("express-async-handler");
const authService = require("../services/authService");

// @desc    Register new therapist
// @route   POST /auth/signup
// @access  Public
const registerTherapist = asyncHandler(async (req, res) => {
  const { username, email, password, cnic } = req.body;
  const {
    educationCertificates,
    professionalLicense,
    professionalMemberships,
    experienceCertificates,
    criminalRecordCheck,
  } = req.files;

  try {
    const user = await authService.registerTherapist(
      username,
      email,
      password,
      cnic,
      educationCertificates,
      professionalLicense,
      professionalMemberships,
      experienceCertificates,
      criminalRecordCheck
    );
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Authenticate a user
// @route   POST /auth/login
// @access  Public
const loginTherapist = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authService.loginTherapist(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Reset user password
// @route   POST /auth/reset-password
// @access  Public
const getTherapist = asyncHandler(async (req, res) => {
  const id = req.user.id;

  try {
    const user = await authService.getTherapist(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Save profile info
// @route   POST /auth/profile
// @access  Private
const saveProfile = asyncHandler(async (req, res) => {
  const {
    therapistId,
    name,
    about,
    speciality,
    location,
    totalPatients,
    experience,
    hourlyRate,
    stripeId,
    cardNumber,
  } = req.body;

  try {
    const response = await authService.saveProfile(
      therapistId,
      name,
      about,
      speciality,
      location,
      totalPatients,
      experience,
      hourlyRate,
      stripeId,
      cardNumber
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = {
  registerTherapist,
  loginTherapist,
  getTherapist,
  saveProfile,
};
