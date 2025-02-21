const Authentication = require('../models/authModel');
const twilio = require('../config/twilio');
const { generateOTP } = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Multer setup for profile image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure 'uploads' folder exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage }).single('profileImage');

exports.sendOTP = async (req, res) => {
    const { countryCode, mobileNumber } = req.body;

    // Validation
    if (!countryCode || !mobileNumber) {
        return res.status(400).json(errorResponse('Country code and mobile number are required'));
    }

    const formattedNumber = `+${countryCode}${mobileNumber}`;
    console.log("Sending OTP to:", formattedNumber);
    console.log("Using Twilio From Number:", process.env.TWILIO_PHONE);

    const otp = generateOTP();

    try {
        let existingUser = await Authentication.findOne({ countryCode, mobileNumber });

        if (existingUser) {
            existingUser.otp = otp;
            existingUser.createdAt = new Date();
            await existingUser.save();
        } else {
            await Authentication.create({ countryCode, mobileNumber, otp });
        }

        // Send OTP via Twilio
        await twilio.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE,
            to: formattedNumber
        });

        return res.status(200).json(successResponse('OTP sent successfully'));

    } catch (err) {
        console.error("Error sending OTP:", err);
        return res.status(500).json(errorResponse('Failed to send OTP', 500));
    }
};

exports.verifyOTP = async (req, res) => {
    const { countryCode, mobileNumber, otp } = req.body;

    // Validation
    if (!countryCode || !mobileNumber || !otp) {
        return res.status(400).json(errorResponse('Country code, mobile number, and OTP are required'));
    }

    try {
        const otpRecord = await Authentication.findOne({ countryCode, mobileNumber, otp });

        if (!otpRecord) {
            return res.status(400).json(errorResponse('Invalid or expired OTP'));
        }

        // Delete the OTP record after successful verification
        await Authentication.deleteOne({ _id: otpRecord._id });

        return res.status(200).json(successResponse('OTP verified successfully'));
        
    } catch (err) {
        console.error("Error verifying OTP:", err);
        return res.status(500).json(errorResponse('Failed to verify OTP', 500));
    }
};


exports.registerUser = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json(errorResponse('Profile image upload failed'));
        }

        const { fullName, countryCode, mobileNumber, gender, pet_ids, breed_ids, userType } = req.body;

        // Validation
        if (!fullName || !countryCode || !mobileNumber || !gender || !userType) {
            return res.status(400).json(errorResponse('All required fields must be filled'));
        }

        if (!['Pet Owner', 'Pet Adopter'].includes(userType)) {
            return res.status(400).json(errorResponse('Invalid user type'));
        }

        try {
            // Check if user already exists
            let existingUser = await User.findOne({ mobileNumber });

            if (existingUser) {
                return res.status(400).json(errorResponse('User already registered with this mobile number'));
            }

            const newUser = new User({
                fullName,
                countryCode,
                mobileNumber,
                gender,
                profileImage: req.file ? `${process.env.BASE_URL}/uploads/${req.file.filename}` : null,
                pet_ids: pet_ids ? JSON.parse(pet_ids) : [],
                breed_ids: breed_ids ? JSON.parse(breed_ids) : [],
                userType
            });

            await newUser.save();

            // Generate JWT Token
            const token = jwt.sign({ userId: newUser._id, userType }, process.env.JWT_SECRET, { expiresIn: '7d' });

            // Construct response data
            const responseData = {
                userId: newUser._id,
                user_type: userType === 'Pet Owner' ? 1 : 2,
                first_name: newUser.fullName.split(' ')[0] || '',
                last_name: newUser.fullName.split(' ')[1] || '',
                email: `${newUser.fullName.split(' ')[0]}@example.com`, // Placeholder email
                mobile_no: newUser.mobileNumber,
                main_role: userType === 'Pet Owner' ? 1 : 2,
                isActive: true,
                isMemoRights: true,
                isDefaulter: false,
                isBlackList: false,
                phone_code: newUser.countryCode,
                defaulterMsg: null,
                token: token,
                profile_pic_url: newUser.profileImage
            };

            res.status(200).json({
                status: 200,
                message: "Register successfully !!",
                data: responseData,
                error: false
            });

        } catch (err) {
            console.error("Error registering user:", err);
            return res.status(500).json(errorResponse('Failed to register user'));
        }
    });
};


