import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { config } from "./config/config.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());

// ===== JWT Protect Middleware =====
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1].trim();
    }

    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, config.jwtSecret);

        // attach full user object without password
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) return res.status(401).json({ message: "User not found" });

        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// ===== Routes =====
app.use("/api/auth", authRoutes);   // register, login, google-login
app.use("/api/users", userRoutes);  // profile, user management

// ===== Test Protected Route =====
app.get("/api/protected", protect, (req, res) => {
    res.json({ message: `Hello ${req.user.name}, you accessed a protected route!` });
});

// ===== MongoDB Connection =====
mongoose
    .connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// ===== Start Server =====
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
