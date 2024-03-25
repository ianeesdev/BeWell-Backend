const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: {
      type: String,
      required: [false, "Please add a name"],
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a strong password"],
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
    sessionId: {
      type: String,
      default: "hi"
    },
    onboardingResponses: [
      {
        title: String,
        selectedOption: String,
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);