const express = require('express');
const { sendOTP, verifyOTP, registerUser, profileUser,updateProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', registerUser);
router.get('/profile', authMiddleware, profileUser);
router.post('/profile/update', authMiddleware, updateProfile);

module.exports = router;