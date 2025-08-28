import express from "express";
import { User } from "../models/User.js";
import { OAuth2client } from "google-auth-library";



const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single user by shortId
router.get("/users/:shortId", async (req, res) => {
    try {
        const user = await User.findOne({ shortId: req.params.shortId });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a user by shortId
router.put("/users/:shortId", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ shortId: req.params.shortId }, req.body, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a user by shortId
router.delete("/users/:shortId", async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ shortId: req.params.shortId });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Google oauth
const client = new OAuth2client(process.env.GOOGLE_CLIENT_ID);
if (req.body.googleToken) {
    const ticket = await client.verifyIdToken({
        idToken: req.body.googleToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getpayLoad();
    const email = payload.email;
}




export default router;
