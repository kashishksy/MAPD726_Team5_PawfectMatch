require('dotenv').config();
const express = require('express');
const mongoose = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const petRoutes = require('./src/routes/petRoutes');
const breedRoutes = require('./src/routes/breedRoutes');
const animalRoutes = require('./src/routes/animalRoutes');
const favoriteRoutes = require('./src/routes/favoriteRoutes');


const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve profile images
app.use('/api/auth', authRoutes);
app.use('/api', petRoutes);
app.use('/api', breedRoutes);
app.use('/api', animalRoutes);
app.use('/api', favoriteRoutes);

app.use(errorHandler);
app.get('/', (req, res) => {
    res.send('Hello World');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));