const express = require('express');
const { sendOTP, verifyOTP,registerUser } = require('../controllers/authController');
const router = express.Router();
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', registerUser);

module.exports = router;