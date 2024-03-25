const asyncHandler = require("express-async-handler");
const Journal = require("../models/journalsModel");

// @desc    Add a new journal entry and get all journals for the user
// @route   POST /journals/add
// @access  Private
const addJournal = asyncHandler(async (req, res) => {
  const { title, text, createdBy } = req.body;

  await Journal.create({ title, text, createdBy });

  const userJournals = await Journal.find({ createdBy });

  res.status(201).json({ data: userJournals });
});

// @desc    Delete a journal entry 
// @route   DELETE /journals/delete/:id
// @access  Private
const deleteJournal = asyncHandler(async (req, res) => {
  const { journalId } = req.params;

  // Ensure that only the user who created the journal can delete it
  const journal = await Journal.findByIdAndDelete(journalId);

  if (!journal) {
    res.status(404);
    throw new Error("Journal not found or unauthorized to delete");
  }

  res.json({ success: true, message: "Journal deleted successfully" });
});

// @desc    Get all journals of a specific user
// @route   GET /journals/get/:userId
// @access  Private
const getAllJournalsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const journals = await Journal.find({ createdBy: userId });

  res.status(200).json({ data: journals });
});

module.exports = {
  addJournal,
  deleteJournal,
  getAllJournalsByUser
};
