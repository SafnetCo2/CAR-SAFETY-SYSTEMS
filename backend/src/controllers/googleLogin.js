// controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// === GOOGLE LOGIN ===
export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body; // Google token from frontend

        // Verify token with Google
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if not found
            user = await User.create({
                name,
                email,
                picture,
                password: null,  // since it's Google login
                provider: "google",
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Google login successful",
            token,
            user,
        });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: "Google login failed", error: error.message });
    }
};
