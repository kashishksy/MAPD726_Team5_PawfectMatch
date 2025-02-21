const mongoose = require('mongoose');

const breedSchema = new mongoose.Schema({
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    name: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Breed', breedSchema);
