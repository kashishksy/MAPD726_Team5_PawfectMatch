const mongoose = require('mongoose');

const AnimalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    images: { type: [String], required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    petType: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    breedType: { type: mongoose.Schema.Types.ObjectId, ref: "Breed" },
    size: { type: String, enum: ["Small", "Medium", "Large"], required: true },
    age: { type: String, enum: ["Baby", "Young", "Adult", "Senior"], required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    owner: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Animal', AnimalSchema);
