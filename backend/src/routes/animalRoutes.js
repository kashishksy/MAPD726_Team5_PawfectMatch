const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/animals', authMiddleware, animalController.getAnimalList);
router.post('/animals/search', authMiddleware, animalController.searchAnimals);
router.get('/animals/:id', authMiddleware, animalController.getAnimalDetails);

module.exports = router;
