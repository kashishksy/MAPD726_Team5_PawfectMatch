require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db'); // Import database connection
const http = require('http');
const socketIo = require('socket.io');

const authRoutes = require('./src/routes/authRoutes');
const petRoutes = require('./src/routes/petRoutes');
const breedRoutes = require('./src/routes/breedRoutes');
const animalRoutes = require('./src/routes/animalRoutes');
const favoriteRoutes = require('./src/routes/favoriteRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const Chat = require('./src/models/chatModel');
const Message = require('./src/models/messageModel');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
connectDB();

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('joinChat', ({ chatId }) => {
        socket.join(chatId);
        console.log(`User joined chat: ${chatId}`);
    });

    socket.on('sendMessage', async ({ chatId, senderId, message }) => {
        try {
            const newMessage = new Message({ chatId, sender: senderId, message });
            await newMessage.save();

            io.to(chatId).emit('newMessage', newMessage); // Emit to all users in chat
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve profile images

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', petRoutes);
app.use('/api', breedRoutes);
app.use('/api', animalRoutes);
app.use('/api', favoriteRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Use `server.listen` for WebSocket support
