import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js"; // your routes
import { config } from "./config/config.js";

dotenv.config();

const app = express();
const PORT = config.port || 5000;

// ===== CORS =====
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://car-safety-systems-1.onrender.com"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow server-to-server or Postman
        if (allowedOrigins.indexOf(origin) === -1) {
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
