import dotenv from "dotenv";
dotenv.config(); // Load .env first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "./config/config.js";
import routes from "./routes/index.js";

const app = express();

// ===== CORS =====
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow Postman or server-to-server
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

// ===== MongoDB Connection =====
mongoose.connect(config.mongoUri)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));

// ===== Start Server =====
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log("CORS allowed origins:", config.corsOrigin);
});