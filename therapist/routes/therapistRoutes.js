const express = require("express");
const router = express.Router();

const {
  addTherapist,
  getTherapist,
} = require("../controllers/therapistController");

router.post("/add", addTherapist);
router.get("/:id", getTherapist);

module.exports = router;
