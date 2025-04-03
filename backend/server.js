require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./src/routes/authRoutes');
const petRoutes = require('./src/routes/petRoutes');
const breedRoutes = require('./src/routes/breedRoutes');
const animalRoutes = require('./src/routes/animalRoutes');
const favoriteRoutes = require('./src/routes/favoriteRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const Chat = require('./src/models/chatModel');
const Message = require('./src/models/messageModel');
const User = require('./src/models/userModel');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

connectDB();

// Store online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat: ${chatId}`);
    });

    socket.on("sendMessage", async (data) => {
        const { chatId, sender, message } = data;
        const newMessage = new Message({ chatId, sender, message });

        await newMessage.save();
        await Chat.findByIdAndUpdate(chatId, { lastMessage: message, lastMessageTime: Date.now() });

        io.to(chatId).emit("newMessage", newMessage);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api', petRoutes);
app.use('/api', breedRoutes);
app.use('/api', animalRoutes);
app.use('/api', favoriteRoutes);
app.use('/api/chats', chatRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
