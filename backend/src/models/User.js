import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    name: String,
    company: String,
    country: { type: String, default: 'US' },
    shortId: { type: String, unique: true, index: true }, // <-- added
}, { timestamps: true });

// Generate shortId before saving if missing
userSchema.pre('save', async function (next) {
    if (!this.shortId) {
        this.shortId = Math.random().toString(36).substring(2, 8); // 6-char shortId
    }

    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password comparison method
userSchema.methods.comparePassword = function (pw) {
    return bcrypt.compare(pw, this.password);
};

export const User = mongoose.model('User', userSchema);
export default User;
