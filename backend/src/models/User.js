import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define User Schema
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false, required: true }, // hide password by default
        role: { type: String, default: "user" },
        shortId: { type: String, unique: true },
        googleId: { type: String },
        picture: { type: String },
        company: { type: String },
        country: { type: String },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model
const User = mongoose.model("User", userSchema);

export default User;
