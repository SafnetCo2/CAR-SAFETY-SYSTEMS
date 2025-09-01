import dotenv from 'dotenv';
import Joi from 'joi';
import { logger } from '../utils/logger.js';

dotenv.config();

const envSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(5000),
    MONGO_URI: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_REFRESH_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRES_IN: Joi.string().default('7d'),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
    CORS_ORIGIN: Joi.string().uri().default('http://localhost:3000'),
    GOOGLE_CLIENT_ID: Joi.string().required(),
}).unknown();

const { value: envVars, error } = envSchema.validate(process.env);

if (error) {
    logger.error(`Config validation error: ${error.message}`);
    process.exit(1); // Stop app if critical config is missing
}

// Extra check for JWT secrets
if (!envVars.JWT_SECRET || !envVars.JWT_REFRESH_SECRET) {
    logger.error("JWT_SECRET or JWT_REFRESH_SECRET is missing! Please set it in .env");
    process.exit(1);
}

export const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoUri: envVars.MONGO_URI,
    jwtSecret: envVars.JWT_SECRET,
    jwtExpiresIn: envVars.JWT_EXPIRES_IN,
    jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
    corsOrigin: envVars.CORS_ORIGIN,
    googleClientId: envVars.GOOGLE_CLIENT_ID,
};
