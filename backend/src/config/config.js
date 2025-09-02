// src/config/config.js
import dotenv from "dotenv";
import Joi from "joi";
import { logger } from "../utils/logger.js";

dotenv.config();

// ===== Validate environment variables =====
const envSchema = Joi.object({
    NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
    PORT: Joi.number().default(5000),
    MONGO_URI: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_REFRESH_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRES_IN: Joi.string().default("7d"),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default("7d"),
    CORS_ORIGIN: Joi.string().uri().default("http://localhost:3000"),
    GOOGLE_CLIENT_ID: Joi.string().required(),
}).unknown();

const { value: envVars, error } = envSchema.validate(process.env);

if (error) {
    logger.error(`Config validation error: ${error.message}`);
    process.exit(1);
}

// ===== Allowed origins ===== 
const devOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'];


const prodOrigins = ["https://car-safety-systems-1.onrender.com"];
const allowedOrigins = envVars.NODE_ENV === "development" ? devOrigins : prodOrigins;

export const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoUri: envVars.MONGO_URI,
    jwtSecret: envVars.JWT_SECRET,
    jwtExpiresIn: envVars.JWT_EXPIRES_IN,
    jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
    corsOrigin: allowedOrigins,
    googleClientId: envVars.GOOGLE_CLIENT_ID,
};
