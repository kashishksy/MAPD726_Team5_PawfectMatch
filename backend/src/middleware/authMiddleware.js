const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const User = require('../models/userModel');

// Read the public key from the public.pem file
const publicKeyPath = path.join(__dirname, '../../keys/public.pem');

let PUBLIC_KEY;
try {
    PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');
} catch (err) {
    console.error("Error reading public key file:", err);
}

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ status: 401, message: "Access denied. No token provided." });
        }

        // Remove "Bearer " if present
        const tokenValue = token.replace('Bearer ', '');

        // Decode the token without verification to inspect it
        const decodedUnverified = jwt.decode(tokenValue);

        if (!decodedUnverified) {
            return res.status(401).json({ status: 401, message: "Invalid token format." });
        }

        // Verify the token using the public key
        let decoded;
        try {
            decoded = jwt.verify(tokenValue, PUBLIC_KEY, { algorithms: ['RS256'] });
        } catch (error) {
            console.error("JWT Verification Error:", error.message);
            return res.status(401).json({ status: 401, message: "Unauthorized. Invalid or expired token." });
        }

        // Check if user exists
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ status: 401, message: "Invalid token. User not found." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Middleware Error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error." });
    }
};
