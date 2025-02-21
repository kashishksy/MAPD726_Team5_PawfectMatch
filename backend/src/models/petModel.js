const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
