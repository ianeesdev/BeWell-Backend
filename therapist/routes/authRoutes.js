const express = require("express");
const router = express.Router();

const {
  registerTherapist,
  loginTherapist,
  getTherapist,
  saveProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadFolder = "uploads";
    const uploadFolderPath = path.join(__dirname, "..", uploadFolder);
    
    // Check if uploads folder exists, create it if not
    if (!fs.existsSync(uploadFolderPath)) {
      fs.mkdirSync(uploadFolderPath);
    }
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/signup", upload.fields([
  { name: "educationCertificates", maxCount: 10 }, // Multiple files for educationCertificates
  { name: "professionalLicense", maxCount: 1 }, // Single file for professionalLicense
  { name: "professionalMemberships", maxCount: 10 }, // Multiple files for professionalMemberships
  { name: "experienceCertificates", maxCount: 10 }, // Multiple files for experienceCertificates
  { name: "criminalRecordCheck", maxCount: 1 } // Single file for criminalRecordCheck
]), registerTherapist);

router.post("/login", loginTherapist);
router.get("/getUser", protect, getTherapist);
router.post("/profile", saveProfile);

module.exports = router;
