import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { config } from "../config/config.js";

export const protect = async (req, res, next) => {
    // Get access token from headers
    const token = req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1].trim()
        : null;

    // Optional refresh token from headers
    const refreshToken = req.headers["x-refresh-token"];

    if (!token && !refreshToken) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        if (token) {
            // Verify access token
            const decoded = jwt.verify(token, config.jwtSecret);
            const user = await User.findById(decoded.id).select("-password");
            if (!user) return res.status(401).json({ message: "User not found" });

            req.user = user;
            return next();
        } else if (refreshToken) {
            // Access token missing but refresh token exists
            const decodedRefresh = jwt.verify(refreshToken, config.jwtRefreshSecret);
            const user = await User.findById(decodedRefresh.id).select("-password");
            if (!user) return res.status(401).json({ message: "User not found" });

            // Generate new access token
            const newAccessToken = jwt.sign(
                { id: user._id, email: user.email, role: user.role },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn || "4d" }
            );

            // Send new access token in response headers
            res.setHeader("x-access-token", newAccessToken);

            req.user = user;
            return next();
        }
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please refresh your token." });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};
