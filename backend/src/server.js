import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js"; // central routes file
import { config } from "./config/config.js";
import User from "./models/User.js";
import jwt from "jsonwebtoken";

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
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) return res.status(401).json({ message: "User not found" });
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// ===== Mount all routes =====
app.use("/api", routes); // <-- your index.js handles all route paths

// ===== Test Protected Route =====
app.get("/api/protected", protect, (req, res) => {
    res.json({ message: `Hello ${req.user.name}, you accessed a protected route!` });
});

// ===== MongoDB Connection =====
mongoose
    .connect(config.mongoUri)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// ===== Start Server =====
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
