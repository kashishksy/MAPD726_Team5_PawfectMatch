const express = require("express");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
require("dotenv").config();

const app = express();
connectDB();

app.use(express.json());
app.get("/", (req, res) => res.send("API Running"));
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
