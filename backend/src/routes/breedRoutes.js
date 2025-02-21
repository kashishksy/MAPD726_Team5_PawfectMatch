const express = require('express');
const router = express.Router();
const { getBreedsByPet } = require('../controllers/breedController');

router.post('/breeds', getBreedsByPet); 

module.exports = router;
