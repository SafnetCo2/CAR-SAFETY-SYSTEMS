import express from "express";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ✅ Register
router.post("/register", async (req, res) => {
    try {
        const { email, password, name, company, country, role } = req.body;

        // Check if email exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already exists" });

        // Create new user
        const user = new User({ email, password, name, company, country, role });

        // Generate shortId if not in model pre-save
        if (!user.shortId) {
            user.shortId = Math.random().toString(36).substring(2, 8);
        }

        await user.save();

        // Return user info (without password)
        res.status(201).json({
            email: user.email,
            name: user.name,
            role: user.role,
            country: user.country,
            shortId: user.shortId,
            createdAt: user.createdAt
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Return user info including shortId
        res.json({
            email: user.email,
            name: user.name,
            role: user.role,
            country: user.country,
            shortId: user.shortId,
            createdAt: user.createdAt
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



export default router;
