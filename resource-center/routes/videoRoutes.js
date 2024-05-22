const express = require("express");
const router = express.Router();
const {
  addVideo,
  deleteVideo,
  getAllVideos,
} = require("../controllers/videoController");

router.post("/add", addVideo);
router.delete("/delete/:id", deleteVideo);
router.get("/getAll", getAllVideos);

module.exports = router;
