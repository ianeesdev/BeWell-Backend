const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Report = require("../models/reportModel");
const nodemailer = require("nodemailer");

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

// @desc    Add a report
// @route   POST /reports/addReport
// @access  Private
const addReport = asyncHandler(async (req, res) => {
  const { reportedItem, reporter, description } = req.body;

  try {
    const report = await Report.create({ reportedItem, reporter, description });
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Fetch all reports
// @route   GET /reports/fetchReports
// @access  Private (admin)
const fetchReports = asyncHandler(async (req, res) => {
  try {
    const reports = await Report.find().populate("reportedItem reporter");
    res.status(200).json(reports);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Fetch a single report by ID
// @route   GET /reports/fetchReport/:reportId
// @access  Private (admin)
const fetchReportById = asyncHandler(async (req, res) => {
  const reportId = req.params.reportId;

  try {
    const report = await Report.findById(reportId).populate(
      "reportedItem reporter"
    );

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Remove a user and the associated report
// @route   DELETE /report/removeUserAndReport/:userId/:reportId
// @access  Public
const removeUserAndReport = asyncHandler(async (req, res) => {
  const { userId, reportId } = req.params;

  // Find the user by ID and remove it
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find the report by ID and remove it
  const report = await Report.findById(reportId);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  // Send email notification to the reporter
  const reporter = await User.findById(report.reporter);
  if (reporter) {
    sendEmail(
      reporter,
      "Be Well User Removed",
      "The user you reported has been removed from the platform."
    );
  }

  await report.deleteOne();
  await user.deleteOne();

  res.status(200).json({ message: "User and report removed successfully" });
});

// @desc    Remove a post and the associated report
// @route   DELETE /report/removePostAndReport/:postId/:reportId
// @access  Public
const removePostAndReport = asyncHandler(async (req, res) => {
  const { postId, reportId } = req.params;

  // Find the post by ID and remove it
  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  // Find the report by ID and remove it
  const report = await Report.findById(reportId);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  // Send email notification to the reporter
  const reporter = await User.findById(report.reporter);
  if (reporter) {
    sendEmail(
      reporter,
      "Be Well Post Removed",
      "The post you reported has been removed from the platform."
    );
  }

  await report.deleteOne();
  await post.deleteOne();

  res.status(200).json({ message: "Post and report removed successfully" });
});

module.exports = {
  fetchReportById,
  fetchReports,
  addReport,
  removeUserAndReport,
  removePostAndReport
};
