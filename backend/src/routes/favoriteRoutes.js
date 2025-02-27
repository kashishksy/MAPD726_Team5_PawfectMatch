const express = require('express');
const { toggleFavoriteAnimal, getFavoriteAnimals } = require('../controllers/favoriteController');
const { authMiddleware } = require('../middleware/authMiddleware'); // Ensure user is authenticated
const router = express.Router();

router.post('/favorite-animal', authMiddleware, toggleFavoriteAnimal);
router.get('/favorite-animals', authMiddleware, getFavoriteAnimals);

module.exports = router;
