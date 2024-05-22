const express = require("express");
const router = express.Router();

const {
  addTherapist,
  getTherapist,
  getAllTherapists,
  getNonVerifiedTherapists,
  acceptTherapist,
  rejectTherapist
} = require("../controllers/therapistController");

router.get("/all", getAllTherapists);
router.post("/add", addTherapist);
router.get("/non-verified", getNonVerifiedTherapists);
router.get("/:id", getTherapist);
router.post("/accept/:id", acceptTherapist);
router.delete("/reject/:id", rejectTherapist);

module.exports = router;
