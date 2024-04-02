const express = require("express");
const router = express.Router();

const {
  registerTherapist,
  loginTherapist,
  getTherapist,
  saveProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/signup", registerTherapist);
router.post("/login", loginTherapist);
router.get("/getUser", protect, getTherapist);
router.post("/profile", protect, saveProfile);

module.exports = router;
