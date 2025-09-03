// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

// ---------------- CONFIG ----------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(",").map(o => o.trim()) || [];

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ---------------- MONGOOSE USER SCHEMA ----------------
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    picture: { type: String },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// ---------------- EXPRESS APP ----------------
const app = express();
app.use(express.json());

// ---------------- CORS ----------------
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (CORS_ORIGINS.includes(origin)) return callback(null, true);
        return callback(new Error("CORS not allowed"));
    },
    credentials: true,
}));

// ---------------- JWT ----------------
const generateAccessToken = (user) =>
    jwt.sign({ id: user._id, email: user.email, role: user.role || "user" }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const generateRefreshToken = (user) =>
    jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

// ---------------- ROUTES ----------------

// Health check
app.get("/", (req, res) => res.send("Server is running!"));

// Manual registration
app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({
            message: "User registered",
            user: { id: user._id, name: user.name, email: user.email },
            accessToken: generateAccessToken(user),
            refreshToken: generateRefreshToken(user),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
});

// Manual login
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password required" });

        const user = await User.findOne({ email });
        if (!user || !user.password) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        res.json({
            message: "Login successful",
            user: { id: user._id, name: user.name, email: user.email },
            accessToken: generateAccessToken(user),
            refreshToken: generateRefreshToken(user),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Login failed", error: err.message });
    }
});

// Google login
app.post("/api/auth/google-login", async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ message: "Google credential required" });

        const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        if (!payload?.email) return res.status(400).json({ message: "Invalid Google credential" });

        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = await User.create({
                name: payload.name || "Unknown",
                email: payload.email,
                picture: payload.picture || "",
                googleId: payload.sub,
            });
        }

        res.json({
            message: "Google login successful",
            user: { id: user._id, name: user.name, email: user.email, picture: user.picture },
            accessToken: generateAccessToken(user),
            refreshToken: generateRefreshToken(user),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Google login failed", error: err.message });
    }
});

// ---------------- MONGODB CONNECTION ----------------
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

// ---------------- START SERVER ----------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
