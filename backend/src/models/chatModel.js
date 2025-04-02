const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Two users in a private chat
    lastMessage: { type: String, default: "" },
    lastMessageTime: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Chat", ChatSchema);
