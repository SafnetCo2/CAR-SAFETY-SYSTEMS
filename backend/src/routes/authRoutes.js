import express from "express";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { config } from "../config/config.js";
import pkg from "google-auth-library";

const { OAuth2Client } = pkg;
const router = express.Router();
const client = new OAuth2Client(config.googleClientId);

// ------------------ Register ------------------
router.post("/register", async (req, res) => {
    try {
        const { email, password, name, company, country, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already exists" });

        const user = new User({ email, password, name, company, country, role });

        if (!user.shortId) {
            user.shortId = Math.random().toString(36).substring(2, 8);
        }

        await user.save();

        res.status(201).json({
            email: user.email,
            name: user.name,
            role: user.role,
            country: user.country,
            shortId: user.shortId,
            createdAt: user.createdAt,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ------------------ Login ------------------
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.json({
            email: user.email,
            name: user.name,
            role: user.role,
            country: user.country,
            shortId: user.shortId,
            createdAt: user.createdAt,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ------------------ Google OAuth (Popup) ------------------
router.post("/google-login", async (req, res) => {
    try {
        const { googleToken } = req.body;
        if (!googleToken) return res.status(400).json({ message: "Google token is required" });

        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: config.googleClientId,
        });

        const payload = ticket.getPayload();
        const email = payload.email;

        // Optional: find or create user in DB
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, name: payload.name || "Google User" });
            await user.save();
        }

        res.json({
            message: "Google login success",
            email,
            shortId: user.shortId,
        });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(401).json({ message: "Invalid Google token" });
    }
});

export default router;
