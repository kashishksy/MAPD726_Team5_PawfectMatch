require('dotenv').config();
const express = require('express');
const mongoose = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const petRoutes = require('./src/routes/petRoutes');
const breedRoutes = require('./src/routes/breedRoutes');

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve profile images
app.use('/api/auth', authRoutes);
app.use('/api', petRoutes);
app.use('/api', breedRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));