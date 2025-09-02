import dotenv from "dotenv";
import Joi from "joi";

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
    CORS_ORIGINS: Joi.string().required(), // comma-separated origins
    GOOGLE_CLIENT_ID: Joi.string().required(),
}).unknown();

const { value: envVars, error } = envSchema.validate(process.env);

if (error) {
    console.error(`Config validation error: ${error.message}`);
    process.exit(1);
}

// ===== Convert comma-separated origins into array =====
const allowedOrigins = envVars.CORS_ORIGINS.split(",").map(origin => origin.trim());

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
