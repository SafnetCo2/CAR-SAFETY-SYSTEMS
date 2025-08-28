import express from "express";
import { User } from "../models/User.js";
import pkg from "google-auth-library";
const { OAuth2Client } = pkg;



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
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
router.post("/google-login", async (req, res) => {
    try {
        const { googleToken } = req.body;
        if (!googleToken) {
            return res.status(400).json({
                message: "Google token is required",
                
            })
        }
        //verify token outside block
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        //use email to find or create user in DB

        const payload = ticket.getPayload();
        const email = payload.email;

        res.json({
            message: "Google login success", email
        });

    } catch (error) {
        console.error("Google login error:", error);
        res.status(401).json({ message: "Invalid Google token" });
    }
    
});




export default router;
