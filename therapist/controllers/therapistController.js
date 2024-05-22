const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const Therapist = require("../models/therapistModel");

// Email sending function
function sendEmail(user, subject, message) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "devaneees@gmail.com",
      pass: "brde gskv yihl cfot",
    },
  });

  var mailOptions = {
    from: "devaneees@gmail.com",
    to: user.email,
    subject: subject,
    html: `
      <p>Hello ${user.username},</p>
      <p>${message}</p>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

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

// @desc    Get non-verified therapists
// @route   GET /therapist/non-verified
// @access  Public
const getNonVerifiedTherapists = asyncHandler(async (req, res) => {
  const nonVerifiedTherapists = await Therapist.find({
    verified: false,
  }).select("-password");

  res.status(200).json(nonVerifiedTherapists);
});

// @desc    Accept therapist (verify)
// @route   POST /therapist/accept/:id
// @access  Public
const acceptTherapist = asyncHandler(async (req, res) => {
  const therapist = await Therapist.findById(req.params.id);

  if (therapist) {
    therapist.verified = true;
    await therapist.save();

    // Send email to therapist
    sendEmail(
      therapist,
      "Be Well Verification Successful",
      "Congratulations! Your account has been verified. You can now login using your email and password."
    );

    res.status(200).json({ message: "Therapist verified successfully" });
  } else {
    res.status(404);
    throw new Error("Therapist not found");
  }
});

// @desc    Reject therapist (delete)
// @route   DELETE /therapist/reject/:id
// @access  Public
const rejectTherapist = asyncHandler(async (req, res) => {
  const therapist = await Therapist.findById(req.params.id);

  if (therapist) {
    await therapist.deleteOne();

    // Send email to therapist
    sendEmail(
      therapist,
      "Be Well Verification Failed",
      "We are sorry to inform you that your account verification has been rejected."
    );

    res.status(200).json({ message: "Therapist removed successfully" });
  } else {
    res.status(404);
    throw new Error("Therapist not found");
  }
});

module.exports = {
  addTherapist,
  getTherapist,
  getAllTherapists,
  getNonVerifiedTherapists,
  acceptTherapist,
  rejectTherapist,
};
