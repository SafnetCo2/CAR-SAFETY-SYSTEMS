import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { config } from "../config/config.js";
import { protect } from "../middleware/auth.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();
const googleClient = new OAuth2Client(config.googleClientId);

// ---------- JWT Generators ----------
const generateAccessToken = (user) =>
    jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn || "1h" }
    );

const generateRefreshToken = (user) =>
    jwt.sign({ id: user._id }, config.jwtRefreshSecret, {
        expiresIn: config.jwtRefreshExpiresIn || "7d",
    });

// ---------- AUTH ROUTES ----------

// Register new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role, company, country } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already exists" });

        const user = await User.create({ name, email, password, role, company, country });

        res.status(201).json({
            message: "User registered successfully",
            user: { ...user.toObject(), password: undefined },
            accessToken: generateAccessToken(user),
            refreshToken: generateRefreshToken(user),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Manual login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        user.password = undefined;

        res.json({
            message: "Login successful",
            user,
            accessToken: generateAccessToken(user),
            refreshToken: generateRefreshToken(user),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Google login
router.post("/google-login", async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ message: "Google credential required" });

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: config.googleClientId,
        });

        const payload = ticket.getPayload();
        let user = await User.findOne({ email: payload.email });

        if (!user) {
            user = await User.create({
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                googleId: payload.sub,
            });
        }

        user.password = undefined;

        res.json({
            message: "Google login successful",
            user,
            accessToken: generateAccessToken(user),
            refreshToken: generateRefreshToken(user),
        });
    } catch (error) {
        res.status(500).json({ message: "Google login failed", error: error.message });
    }
});

 








// Refresh token
router.post("/refresh-token", async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

        const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(401).json({ message: "User not found" });

        res.json({ accessToken: generateAccessToken(user) });
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired refresh token" });
    }
});

// ---------- USER ROUTES ----------

// Get current user profile
router.get("/profile/me", protect, async (req, res) => {
    res.json(req.user);
});

// Get all users (admin only)
router.get("/", protect, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single user by shortId
router.get("/:shortId", protect, async (req, res) => {
    try {
        const user = await User.findOne({ shortId: req.params.shortId }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user by shortId (self or admin)
router.put("/:shortId", protect, async (req, res) => {
    try {
        const user = await User.findOne({ shortId: req.params.shortId });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (req.user.role !== "admin" && req.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        Object.assign(user, req.body);
        await user.save();
        user.password = undefined;
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete user by shortId (admin only)
router.delete("/:shortId", protect, adminMiddleware, async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ shortId: req.params.shortId });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create user (admin only)
router.post("/", protect, adminMiddleware, async (req, res) => {
    try {
        const user = new User(req.body);
        if (!user.shortId) user.shortId = Math.random().toString(36).substring(2, 8);
        await user.save();
        user.password = undefined;
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
