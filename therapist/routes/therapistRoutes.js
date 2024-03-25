const express = require("express");
const router = express.Router();

const {
  addTherapist,
  getTherapist,
  getAllTherapists
} = require("../controllers/therapistController");

router.get("/all", getAllTherapists);
router.post("/add", addTherapist);
router.get("/:id", getTherapist);

module.exports = router;
