const express = require("express");
const router = express.Router();
const { addJournal, deleteJournal, getAllJournalsByUser } = require("../controllers/journalController");
const { protect } = require("../middleware/authMiddleware");

// Add a new journal entry
router.post("/add", addJournal);

// Delete a journal entry
router.delete("/delete/:journalId", deleteJournal);

// Get all journals
router.get("/get/:userId", getAllJournalsByUser)

module.exports = router;
