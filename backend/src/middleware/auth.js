import jwt from "jsonwebtoken";
import User from "../models/User.js"; // make sure you import your User model
import { config } from "../config/config.js";

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1].trim();
    }

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);

        // Attach full user object to request (without password)
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
