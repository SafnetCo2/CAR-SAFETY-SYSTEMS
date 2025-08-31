import express from "express";
import  User  from "../models/User.js";

const router = express.Router();

// ✅ Get All Users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Get User by shortId
router.get("/users/:shortId", async (req, res) => {
    try {
        const user = await User.findOne({ shortId: req.params.shortId });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Update User by shortId
router.put("/users/:shortId", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { shortId: req.params.shortId },
            req.body,
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Delete User by shortId
router.delete("/users/:shortId", async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ shortId: req.params.shortId });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// ✅ Create User
router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        if (!user.shortId) user.shortId = Math.random().toString(36).substring(2, 8);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


export default router;
