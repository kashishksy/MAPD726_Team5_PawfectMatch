const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    countryCode: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    profileImage: { type: String }, // Store image URL
    pet_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }], // Array of pet IDs
    breed_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Breed' }], // Array of breed IDs
    userType: { type: String, enum: ['Pet Owner', 'Pet Adopter'], required: true }, // User Type
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
