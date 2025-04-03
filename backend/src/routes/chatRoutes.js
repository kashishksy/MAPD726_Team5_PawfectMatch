const express = require('express');
const { createChat, sendMessage, getMessages, getChats } = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a Chat Between Two Users
router.post('/create', authMiddleware, createChat);
// Fetch All Chats of a User
router.get('/:userId', authMiddleware, getChats);
// Send a Message
router.post('/send', authMiddleware, sendMessage); 
// Fetch Messages in the Chat
router.get('/messages/:chatId', authMiddleware, getMessages); 

module.exports = router;
