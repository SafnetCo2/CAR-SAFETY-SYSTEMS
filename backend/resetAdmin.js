// reset-admin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "../backend/src/models/User.js";
dotenv.config();

const mongoUri = process.env.MONGO_URI; // make sure this matches your backend

async function resetAdmin() {
    try {
        await mongoose.connect(mongoUri, {
            
        });

        const newPassword = "Admin1234";
        const hashed = bcrypt.hashSync(newPassword, 10);

        const result = await User.updateOne(
            { email: "admin@test.com" },
            { $set: { password: hashed } }
        );

        if (result.matchedCount === 0) {
            console.log("Admin not found, creating a new one...");
            await User.create({
                name: "Admin",
                email: "admin@test.com",
                password: hashed,
                shortId: "admin01",
                role: "admin",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        console.log("Admin password is now reset to Admin1234");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

resetAdmin();
