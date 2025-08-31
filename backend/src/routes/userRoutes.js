// src/routes/userRoutes.js
import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// -------- Get All Users (admin only) --------
router.get("/", protect, async (req, res) => {
    try {
        // optionally check if req.user.role === "admin"
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// -------- Get Current User Profile --------
router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// -------- Update Current User Profile --------
router.put("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("+password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const { name, email, password, company, country } = req.body;
        if (name) user.name = name;
        if (email) user.email = email;
        if (company) user.company = company;
        if (country) user.country = country;
        if (password) user.password = password; // will be hashed via model pre-save

        await user.save();
        user.password = undefined;
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// -------- Delete User (admin only) --------
router.delete("/:id", protect, async (req, res) => {
    try {
        // optionally check if req.user.role === "admin"
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.deleteOne();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

import { protect } from "../server.js"; // or your middleware path


// Get current user profile
router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
});

export default router;
