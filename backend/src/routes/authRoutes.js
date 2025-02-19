const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const sendOTP = require("../config/email");
const { saveOTP, verifyOTP, deleteOTP, findUserByEmail } = require("../services/authService");
require("dotenv").config();

const router = express.Router();

// ✅ Generate and send OTP
router.post(
    "/send-otp",
    [body("email").isEmail().withMessage("Invalid email format")],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
            await saveOTP(email, otp);
            await sendOTP(email, otp);

            res.status(200).json({ message: "OTP sent successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error sending OTP", error });
        }
    }
);

// ✅ Verify OTP and issue JWT if user exists
router.post(
    "/verify-otp",
    [
        body("email").isEmail().withMessage("Invalid email format"),
        body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, otp } = req.body;

        try {
            const authRecord = await verifyOTP(email, otp);
            if (!authRecord) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }

            const user = await findUserByEmail(email);

            let token = null;
            let is_register = false;

            if (user) {
                token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
                is_register = true;
            }

            await deleteOTP(email); // Remove OTP after successful verification

            res.status(200).json({
                message: "OTP verified",
                token,
                is_register,
            });
        } catch (error) {
            res.status(500).json({ message: "Error verifying OTP", error });
        }
    }
);

module.exports = router;
