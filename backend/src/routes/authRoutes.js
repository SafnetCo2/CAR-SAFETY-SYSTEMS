import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { config } from "../config/config.js";

const router = express.Router();
const googleClient = new OAuth2Client(config.googleClientId);

// JWT generators
const generateAccessToken = (user) =>
    jwt.sign({ id: user._id, email: user.email, role: user.role || "user" }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    });

const generateRefreshToken = (user) =>
    jwt.sign({ id: user._id }, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn });

// ------------------ GOOGLE LOGIN ------------------
router.post("/google-login", async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ message: "Google credential required" });

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: config.googleClientId,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) return res.status(400).json({ message: "Invalid Google credential" });

        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = await User.create({
                name: payload.name || "Unknown",
                email: payload.email,
                picture: payload.picture || "",
                googleId: payload.sub,
            });
        }

        user = user.toObject();
        delete user.password;

        res.json({
            message: "Google login successful",
            user,
            accessToken: generateAccessToken(user),
            refreshToken: generateRefreshToken(user),
        });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: "Google login failed", error: error.message });
    }
});

// ------------------ MANUAL REGISTER ------------------
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "Name, email, and password are required" });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.password = undefined; // hide password
        res.status(201).json({ message: "User registered", user, accessToken, refreshToken });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
});

// ------------------ MANUAL LOGIN ------------------
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.password = undefined; // hide password
        res.json({ message: "Login successful", user, accessToken, refreshToken });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

export default router;
