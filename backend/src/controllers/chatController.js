const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const { successResponse, errorResponse } = require('../utils/response');

// Start a private chat between two users
exports.createChat = async (req, res) => {
    try {
        const { userId1, userId2 } = req.body;

        // Check if chat already exists
        let chat = await Chat.findOne({ participants: { $all: [userId1, userId2] } });

        if (!chat) {
            chat = new Chat({ participants: [userId1, userId2] });
            await chat.save();
        }

        return res.status(200).json({ status: 200, message: "Chat created successfully", chat });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Internal Server Error", error: error.message });
    }
};

// Get all chats of a user
exports.getChats = async (req, res) => {
    try {
        const { userId } = req.params;
        const chats = await Chat.find({ participants: userId }).populate("participants", "name profileImage");

        return res.status(200).json({ status: 200, message: "Chats fetched successfully", chats });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Internal Server Error", error: error.message });
    }
};

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { chatId, sender, message } = req.body;

        const newMessage = new Message({ chatId, sender, message });
        await newMessage.save();

        await Chat.findByIdAndUpdate(chatId, { lastMessage: message, lastMessageTime: Date.now() });

        return res.status(201).json({ status: 201, message: "Message sent successfully", data: newMessage });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Internal Server Error", error: error.message });
    }
};

// Get all messages in a chat
exports.getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

        return res.status(200).json({ status: 200, message: "Messages fetched successfully", data: messages });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Internal Server Error", error: error.message });
    }
};
