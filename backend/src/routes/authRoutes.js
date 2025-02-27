const express = require('express');
const { sendOTP, verifyOTP,registerUser, checkUser } = require('../controllers/authController');
const router = express.Router();
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', registerUser);
router.post('/check-user', checkUser);

module.exports = router;