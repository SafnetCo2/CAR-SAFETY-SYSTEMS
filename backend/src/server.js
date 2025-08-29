import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import logger from "./utils/logger.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

// ---------------- Middleware ----------------

// Enable CORS for frontend
app.use(cors({
    origin: ["http://localhost:3000",
        "https://car-safety-systems-1.onrender.com"],

    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// ---------------- Routes ----------------

// Mount all routes at /api
app.use("/api", routes);

// ---------------- Connect to MongoDB & Start Server ----------------

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        logger.info("✅ MongoDB connected");
        app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => logger.error("❌ MongoDB connection error:", err));