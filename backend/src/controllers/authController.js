const Authentication = require('../models/authModel');
const twilio = require('../config/twilio');
const { generateOTP } = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        return cb(new Error('Only JPG, JPEG, and PNG files are allowed!'), false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure 'uploads' folder exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // Limit file size to 2MB
}).single('profileImage');

const privateKeyPath = path.join(__dirname, '../../keys/private.pem');
const PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8');

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

        // Check if user exists
        const user = await User.findOne({ countryCode, mobileNumber });

        let token = null;
        let is_register = !!user; // If user exists, is_register = true; otherwise, false

        // If the user exists, generate JWT token
        if (user) {
            token = jwt.sign(
                { userId: user._id, mobileNumber: user.mobileNumber },
                PRIVATE_KEY,
                { algorithm: 'RS256', expiresIn: '7d' }
            );
        }

        // Delete the OTP record after successful verification
        await Authentication.deleteOne({ _id: otpRecord._id });

        return res.status(200).json(successResponse('OTP verified successfully', {
            is_register,
            token
        }));

    } catch (err) {
        console.error("Error verifying OTP:", err);
        return res.status(500).json(errorResponse('Failed to verify OTP', 500));
    }
};

exports.registerUser = async (req, res) => {
    upload(req, res, async (err) => {
        let uploadedFilePath = req.file ? path.join(__dirname, '../uploads/', req.file.filename) : null;

        if (err) {
            let errorMessage = 'Profile image upload failed';

            if (err.message.includes('Only JPG, JPEG, and PNG files are allowed!')) {
                errorMessage = 'Invalid file format. Only JPG, JPEG, and PNG are allowed.';
            } else if (err.message.includes('File too large')) {
                errorMessage = 'File size exceeds the limit (2MB).';
            }

            return res.status(400).json(errorResponse(errorMessage));
        }

        const { fullName, countryCode, mobileNumber, gender, pet_ids, breed_ids, userType } = req.body;

        // Validation for required fields
        const requiredFields = { fullName, countryCode, mobileNumber, gender, userType };
        const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);

        if (missingFields.length > 0) {
            if (uploadedFilePath && fs.existsSync(uploadedFilePath)) fs.unlinkSync(uploadedFilePath);
            return res.status(400).json(errorResponse(`${missingFields[0]} field is required`));
        }

        if (!['Pet Owner', 'Pet Adopter'].includes(userType)) {
            if (uploadedFilePath && fs.existsSync(uploadedFilePath)) fs.unlinkSync(uploadedFilePath);
            return res.status(400).json(errorResponse('Invalid user type'));
        }

        try {
            // Check if user already exists
            let existingUser = await User.findOne({ mobileNumber });

            if (existingUser) {
                if (uploadedFilePath && fs.existsSync(uploadedFilePath)) fs.unlinkSync(uploadedFilePath);
                return res.status(400).json(errorResponse('User already registered with this mobile number'));
            }

            const hostUrl = `${req.protocol}://${req.get('host')}`;

            const newUser = new User({
                fullName,
                countryCode,
                mobileNumber,
                gender,
                profileImage: uploadedFilePath ? `${hostUrl}/uploads/${req.file.filename}` : null,
                pet_ids: pet_ids ? JSON.parse(pet_ids) : [],
                breed_ids: breed_ids ? JSON.parse(breed_ids) : [],
                userType
            });

            await newUser.save();

            const token = jwt.sign(
                { userId: user._id, mobileNumber: user.mobileNumber },
                PRIVATE_KEY,
                { algorithm: 'RS256', expiresIn: '7d' }
            );

            // Construct response data
            const responseData = {
                userId: newUser._id,
                fullName: newUser.fullName,
                phone_code: newUser.countryCode,
                mobile_no: newUser.mobileNumber,
                gender: newUser.gender,
                profile_pic_url: newUser.profileImage,
                pet_ids: newUser.pet_ids,
                breed_ids: newUser.breed_ids,
                user_type: newUser.userType,
                token: token,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            };

            res.status(200).json({
                status: 200,
                message: "Register successfully !!",
                data: responseData,
                error: false
            });

        } catch (err) {
            console.error("Error registering user:", err);
            if (uploadedFilePath && fs.existsSync(uploadedFilePath)) fs.unlinkSync(uploadedFilePath);
            return res.status(500).json(errorResponse('Failed to register user'));
        }
    });
};

exports.checkUser = async (req, res) => {
    const { countryCode, mobileNumber } = req.body;

    try {
        const user = await User.findOne({ countryCode, mobileNumber });
        
        if (user) {
            // Generate new JWT token for the user
            const token = jwt.sign(
                { userId: user._id, userType: user.userType }, 
                process.env.JWT_SECRET, 
                { expiresIn: '7d' }
            );

            return res.status(200).json({
                status: 200,
                message: "User found",
                exists: true,
                data: {
                    userId: user._id,
                    user_type: user.userType === 'Pet Owner' ? 1 : 2,
                    first_name: user.fullName.split(' ')[0] || '',
                    last_name: user.fullName.split(' ')[1] || '',
                    mobile_no: user.mobileNumber,
                    main_role: user.userType === 'Pet Owner' ? 1 : 2,
                    isActive: true,
                    phone_code: user.countryCode,
                    token: token,
                    profile_pic_url: user.profileImage
                },
                error: false
            });
        }

        return res.status(200).json({
            status: 200,
            message: "User not found",
            exists: false,
            error: false
        });

    } catch (err) {
        console.error("Error checking user:", err);
        return res.status(500).json(errorResponse('Failed to check user'));
    }
};

exports.profileUser = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;

        if (!userId) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized. User not authenticated.",
                error: true
            });
        }

        // Fetch user details excluding sensitive data like password
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
                error: true
            });
        }

        // Construct response data
        const responseData = {
            userId: user._id,
            fullName: user.fullName,
            phone_code: user.countryCode,
            mobile_no: user.mobileNumber,
            gender: user.gender,
            profile_pic_url: user.profileImage,
            pet_ids: user.pet_ids,
            breed_ids: user.breed_ids,
            user_type: user.userType,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return res.status(200).json({
            status: 200,
            message: "User profile fetched successfully",
            data: responseData,
            error: false
        });

    } catch (err) {
        console.error("Error fetching user profile:", err);
        return res.status(500).json({
            status: 500,
            message: "Failed to fetch user profile",
            error: err.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    upload(req, res, async (err) => {
        let uploadedFilePath = req.file ? path.join(__dirname, '../uploads/', req.file.filename) : null;

        if (err) {
            let errorMessage = 'Profile image upload failed';

            if (err.message.includes('Only JPG, JPEG, and PNG files are allowed!')) {
                errorMessage = 'Invalid file format. Only JPG, JPEG, and PNG are allowed.';
            } else if (err.message.includes('File too large')) {
                errorMessage = 'File size exceeds the limit (2MB).';
            }

            return res.status(400).json({ status: 400, message: errorMessage, error: true });
        }

        try {
            const userId = req.user ? req.user._id : null;

            if (!userId) {
                if (uploadedFilePath && fs.existsSync(uploadedFilePath)) fs.unlinkSync(uploadedFilePath);
                return res.status(401).json({ status: 401, message: "Unauthorized. User not authenticated.", error: true });
            }

            const { fullName, gender, pet_ids, breed_ids, userType } = req.body;

            // Fetch the user from the database
            let user = await User.findById(userId);

            if (!user) {
                if (uploadedFilePath && fs.existsSync(uploadedFilePath)) fs.unlinkSync(uploadedFilePath);
                return res.status(404).json({ status: 404, message: "User not found", error: true });
            }

            // Update user fields if provided
            if (fullName) user.fullName = fullName;
            if (gender) user.gender = gender;
            if (pet_ids) user.pet_ids = JSON.parse(pet_ids);
            if (breed_ids) user.breed_ids = JSON.parse(breed_ids);
            if (userType) {
                if (!['Pet Owner', 'Pet Adopter'].includes(userType)) {
                    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) fs.unlinkSync(uploadedFilePath);
                    return res.status(400).json({ status: 400, message: "Invalid user type", error: true });
                }
                user.userType = userType;
            }

            // Handle profile image update
            if (uploadedFilePath) {
                const hostUrl = `${req.protocol}://${req.get('host')}`;

                // Delete old profile image if exists
                if (user.profileImage) {
                    const oldImagePath = path.join(__dirname, '../uploads/', path.basename(user.profileImage));
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }

                user.profileImage = `${hostUrl}/uploads/${req.file.filename}`;
            }

            // Save the updated user details
            await user.save();

            // Construct response data
            const responseData = {
                userId: user._id,
                fullName: user.fullName,
                phone_code: user.countryCode,
                mobile_no: user.mobileNumber,
                gender: user.gender,
                profile_pic_url: user.profileImage,
                pet_ids: user.pet_ids,
                breed_ids: user.breed_ids,
                user_type: user.userType,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };

            res.status(200).json({
                status: 200,
                message: "Profile updated successfully!",
                data: responseData,
                error: false
            });

        } catch (err) {
            console.error("Error updating profile:", err);
            if (uploadedFilePath && fs.existsSync(uploadedFilePath)) fs.unlinkSync(uploadedFilePath);
            return res.status(500).json({ status: 500, message: "Failed to update profile", error: err.message });
        }
    });
};


