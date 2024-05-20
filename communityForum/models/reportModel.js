const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", // Reference the Post model
    required: true,
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
