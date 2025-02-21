const mongoose = require('mongoose');
const authSchema = new mongoose.Schema({
    countryCode: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 },
});
module.exports = mongoose.model("Authentication", authSchema);
