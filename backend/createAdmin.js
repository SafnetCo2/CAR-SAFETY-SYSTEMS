import mongoose from "mongoose";
import User from "../backend/src/models/User.js"; // adjust path if needed
import { config } from "../backend/src/config/config.js"; // adjust path if needed

const createAdmin = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log("MongoDB connected");

        const email = "admin@test.com";
        const plainPassword = "Admin@1234";

        // Check if admin exists
        let admin = await User.findOne({ email }).select("+password");

        if (admin) {
            // Update password by assigning plaintext—pre("save") will hash it automatically
            admin.password = plainPassword;
            await admin.save();
            console.log("Admin password updated:", admin.email);
        } else {
            // Create new admin user
            admin = await User.create({
                name: "Admin",
                email,
                password: plainPassword, // plain text, will be hashed automatically
                role: "admin",
                shortId: "admin01",
            });
            console.log("Admin user created:", admin.email);
        }

        await mongoose.disconnect();
        console.log("MongoDB disconnected");
    } catch (err) {
        console.error("Error creating admin:", err);
    }
};

createAdmin();
