const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true
  }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
