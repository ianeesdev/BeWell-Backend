const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.findOne({
    $or: [
      { users: { $all: [req.user._id, userId] } },
      { users: { $all: [userId, req.user._id] } },
    ],
  }).populate({
    path: "latestMessage",
    populate: {
      path: "sender",
      select: "name image email",
    },
  });

  if (isChat) {
    res.send(isChat);
  } else {
    var senderType = req.user instanceof User ? "User" : "Therapist";
    var chatData = {
      chatName: senderType === "User" ? "User Chat" : "Therapist Chat",
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password").populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name image email",
        },
      });
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});


//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {

    Chat.find({ users: req.user._id })
      .populate([
        { path: "users", select: "-password" },
        { path: "users", model: "Therapist" }
      ])
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name image email",
        },
      })
      .sort({ updatedAt: -1 })
      .then((results) => {
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  accessChat,
  fetchChats
};
