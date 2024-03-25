const asyncHandler = require("express-async-handler");
const Therapist = require("../models/therapistModel");

// @desc    Add new therapist
// @route   POST /therapist/add
// @access  Public
const addTherapist = asyncHandler(async (req, res) => {
  const {
    name,
    about,
    specialty,
    location,
    totalPatients,
    experience,
    hourlyRate,
    reviews,
  } = req.body;

  const therapist = new Therapist({
    name,
    about,
    specialty,
    location,
    totalPatients,
    experience,
    hourlyRate,
    reviews,
  });

  const createdTherapist = await therapist.save();
  res.status(201).json(createdTherapist);
});

// @desc    Get therapist by ID
// @route   GET /therapist/:id
// @access  Public
const getTherapist = asyncHandler(async (req, res) => {
  const therapist = await Therapist.findById(req.params.id);

  if (therapist) {
    res.json(therapist);
  } else {
    res.status(404);
    throw new Error("Therapist not found");
  }
});

// @desc    Get all therapists
// @route   GET /therapist/all
// @access  Public
const getAllTherapists = asyncHandler(async (req, res) => {
  const therapists = await Therapist.find({});

  if (therapists) {
    res.json(therapists);
  } else {
    res.status(404);
    throw new Error("Therapist not found");
  }
});

module.exports = {
  addTherapist,
  getTherapist,
  getAllTherapists
};
