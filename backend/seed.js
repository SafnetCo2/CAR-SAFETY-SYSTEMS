import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import shortid from 'shortid';
import { config } from './src/config/config.js';
import { logger } from './src/utils/logger.js';

import { User } from './src/models/User.js';
import { Vehicle } from './src/models/Vehicle.js';

async function seed() {
    try {
        await mongoose.connect(config.mongoUri);
        logger.info('✅ Connected to MongoDB');

        // Helper to hash passwords
        const hashPassword = async (password) => await bcrypt.hash(password, 10);

        // ---------------- Users ----------------
        const usersToCreate = [
            { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' },
            { name: 'Driver One', email: 'driver1@example.com', password: 'password123', role: 'user' },
            { name: 'Driver Two', email: 'driver2@example.com', password: 'password123', role: 'user' },
        ];

        for (const u of usersToCreate) {
            const existingUser = await User.findOne({ email: u.email });
            if (!existingUser) {
                const newUser = await User.create({
                    name: u.name,
                    email: u.email,
                    password: await hashPassword(u.password),
                    role: u.role
                });
                logger.info(`✅ User created: ${newUser.email}`);
            } else {
                logger.info(`ℹ️ User already exists: ${u.email}`);
            }
        }

        // Map emails to ObjectIds
        const allUsers = await User.find({});
        const userMap = {};
        allUsers.forEach(u => userMap[u.email] = u._id);

        // ---------------- Vehicles ----------------
        const vehiclesToCreate = [
            { userId: userMap['admin@example.com'], vin: 'VIN12345', make: 'Toyota', model: 'Corolla', year: 2020 },
            { userId: userMap['driver1@example.com'], vin: 'VIN12346', make: 'Toyota', model: 'Corolla', year: 2020 },
            { userId: userMap['driver2@example.com'], vin: 'VIN67890', make: 'Honda', model: 'Civic', year: 2019 },
        ];

        for (const v of vehiclesToCreate) {
            const existingVehicle = await Vehicle.findOne({ vin: v.vin, userId: v.userId });
            if (!existingVehicle) {
                const vehicle = new Vehicle(v);
                // Generate a unique shortId
                vehicle.shortId = shortid.generate();
                await vehicle.save();
                logger.info(`✅ Vehicle created: ${vehicle.vin} (${vehicle.shortId})`);
            } else {
                logger.info(`ℹ️ Vehicle already exists: ${v.vin}`);
            }
        }

        logger.info('🌱 Seed process completed successfully!');
        process.exit(0);
    } catch (err) {
        logger.error(`Seeding failed: ${err.message}`);
        process.exit(1);
    }
}

seed();
