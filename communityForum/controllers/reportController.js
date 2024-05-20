const asyncHandler = require("express-async-handler");
const Report = require("../models/reportModel");

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

module.exports = {
  fetchReportById,
  fetchReports,
  addReport,
};
