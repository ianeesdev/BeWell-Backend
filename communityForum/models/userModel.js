const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { 
        type: String, 
        required: true,
        unique: true 
    },
    name: {
      type: String,
      requierd: [true, "Please add a name"],
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      requierd: [true, "Please add an email"],
      unique: true, 
    },
    password: {
      type: String,
      requierd: [true, "Please add a strong password"],
    },
    posts: [
      { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    onboarded: {
      type: Boolean,
      default: false,
    },
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    sessionId: String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);