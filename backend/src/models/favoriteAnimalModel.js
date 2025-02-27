const mongoose = require('mongoose');

const favoriteAnimalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
}, { timestamps: true });

favoriteAnimalSchema.index({ userId: 1, animalId: 1 }, { unique: true });

module.exports = mongoose.model('FavoriteAnimal', favoriteAnimalSchema);
