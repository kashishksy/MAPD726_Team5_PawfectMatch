const express = require('express');
const router = express.Router();
const { getPetList } = require('../controllers/petController');

router.get('/pets', getPetList);

module.exports = router;
