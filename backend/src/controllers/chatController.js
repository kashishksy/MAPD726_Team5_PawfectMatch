const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const { successResponse, errorResponse } = require('../utils/response');

// Start a new chat between Pet Owner and Adopter
exports.startChat = async (req, res) => {
    try {
        const { recipientId } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!recipientId) {
            return res.status(400).json(errorResponse('Recipient ID is required'));
        }

        if (recipientId === userId.toString()) {
            return res.status(400).json(errorResponse('You cannot start a chat with yourself'));
        }

        // Check if recipient exists in User collection
        const recipient = await User.findById(recipientId);
        
        if (!recipient) {
            return res.status(404).json(errorResponse('Recipient not found'));
        }

        // Check if chat already exists
        let chat = await Chat.findOne({ participants: { $all: [userId, recipientId] } });

        if (!chat) {
            chat = new Chat({ participants: [userId, recipientId] });
            await chat.save();
        }

        return res.status(200).json(successResponse('Chat started successfully', { chatId: chat._id }));

    } catch (error) {
        console.error("Error starting chat:", error.message);
        return res.status(500).json(errorResponse('Error starting chat'));
    }
};

// Send a message in a chat
exports.sendMessage = async (req, res) => {
    try {
        const { chatId, message } = req.body;
        const sender = req.user._id;

        // Validate required fields
        if (!chatId) {
            return res.status(400).json(errorResponse('Chat ID is required'));
        }
        if (!message || message.trim() === '') {
            return res.status(400).json(errorResponse('Message cannot be empty'));
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json(errorResponse('Chat not found'));
        }

        const newMessage = new Message({ chatId, sender, message });
        await newMessage.save();

        return res.status(200).json(successResponse('Message sent successfully', newMessage));

    } catch (error) {
        console.error("Error sending message:", error.message);
        return res.status(500).json(errorResponse('Error sending message'));
    }
};

// Get messages of a chat
exports.getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        // Validate required fields
        if (!chatId) {
            return res.status(400).json(errorResponse('Chat ID is required'));
        }

        const messages = await Message.find({ chatId })
            .sort({ createdAt: 1 })
            .populate('sender', 'fullName');

        return res.status(200).json(successResponse('Messages fetched successfully', messages));

    } catch (error) {
        console.error("Error fetching messages:", error.message);
        return res.status(500).json(errorResponse('Error fetching messages'));
    }
};

// Get all chats for a user
exports.getUserChats = async (req, res) => {
    try {
        const userId = req.user._id;

        const chats = await Chat.find({ participants: userId })
            .populate('participants', 'fullName');

        return res.status(200).json(successResponse('User chats fetched successfully', chats));

    } catch (error) {
        console.error("Error fetching user chats:", error.message);
        return res.status(500).json(errorResponse('Error fetching user chats'));
    }
};
