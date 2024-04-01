const mongoose = require("mongoose");
const User = require("../models/userModel");
const Therapist  = require("../models/therapistModel");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Therapist",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
