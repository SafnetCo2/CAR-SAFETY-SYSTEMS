// src/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { config } from "./config/config.js";

dotenv.config();

const app = express();

// ===== CORS =====
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // Postman/server-to-server
        // Only allow requests from your frontend URLs
        if (!config.corsOrigin.includes(origin)) {
            return callback(new Error(`CORS policy: ${origin} not allowed`), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));

// ===== Middleware =====
app.use(express.json());

// ===== Routes =====
app.use("/api", routes);

// ===== MongoDB =====
mongoose.connect(config.mongoUri)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// ===== Start Server =====
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log("CORS allowed origins:", config.corsOrigin);
});
