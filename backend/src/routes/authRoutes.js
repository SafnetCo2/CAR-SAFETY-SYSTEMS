import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { config } from "../config/config.js";

const router = express.Router();
const googleClient = new OAuth2Client(config.googleClientId);

// Generate JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, config.jwtSecret, {
        expiresIn: "1h",
    });
};

// ---------- Register ----------
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role, company, country } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already exists" });

        const user = await User.create({
            name,
            email,
            password, // will be hashed automatically by pre-save hook
            role,
            company,
            country,
        });

        res.status(201).json({
            message: "User registered successfully",
            token: generateToken(user),
            user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ---------- Manual Login ----------
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // explicitly include password
        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        user.password = undefined; // hide password in response

        res.json({
            message: "Login successful",
            token: generateToken(user),
            user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ---------- Google Login ----------
router.post("/google-login", async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential)
            return res.status(400).json({ message: "Google credential required" });

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

        res.json({
            message: "Google login successful",
            token: generateToken(user),
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Google login failed", error: error.message });
    }
});

export default router;
