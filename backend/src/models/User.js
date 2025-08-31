import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: function () {
                return !this.googleId; // required only for manual users
            },
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            minlength: 6,
            select: false, // don't return password by default
        },
        shortId: { type: String, unique: true, default: () => nanoid(8) },
        googleId: {
            type: String,
            default: null,
        },
        picture: { type: String, default: null },
        company: { type: String, default: null },
        country: { type: String, default: null },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
