import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { config } from "./config/config.js";

dotenv.config();

const app = express();
const PORT = config.port || 5000;

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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
