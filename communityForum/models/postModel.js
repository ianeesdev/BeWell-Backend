const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    text: { type: String, required: true },
    image: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parentId: {
        type: String,
    },
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
})

module.exports = mongoose.model("Post", postSchema);