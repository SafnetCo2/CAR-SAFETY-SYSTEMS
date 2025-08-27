import dotenv from 'dotenv';
import Joi from 'joi';
import {logger} from '../utils/logger.js'

dotenv.config();

const envSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(5000),
    MONGO_URI: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRES_IN: Joi.string().default('7d'),
    CORS_ORIGIN: Joi.string().uri().default('http://localhost:5173'),
}).unknown();

const { value: envVars, error } = envSchema.validate(process.env);

if (error) {
    logger.error(` Config validation error: ${error.message}`);
    process.exit(1); // Stop app if critical config is invalid
}

export const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoUri: envVars.MONGO_URI,
    jwtSecret: envVars.JWT_SECRET,
    jwtExpiresIn: envVars.JWT_EXPIRES_IN,
    corsOrigin: envVars.CORS_ORIGIN,
};
