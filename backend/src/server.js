import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import logger from "./utils/logger.js";
import routes from "./routes/index.js";   

dotenv.config();




const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount all routes at /api
app.use("/api", routes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB & Start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        logger.info("MongoDB connected");
        app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => logger.error(" MongoDB connection error:", err));
