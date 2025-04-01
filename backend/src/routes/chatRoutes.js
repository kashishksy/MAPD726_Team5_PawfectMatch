const express = require('express');
const { startChat, sendMessage, getMessages, getUserChats } = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/start', authMiddleware, startChat); // Start a chat
router.post('/send', authMiddleware, sendMessage); // Send a message
router.get('/messages/:chatId', authMiddleware, getMessages); // Get messages for a chat
router.get('/chats', authMiddleware, getUserChats); // Get all user chats

module.exports = router;
