import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    status: {
        type: String,
        enum: ["ongoing", "completed", "cancelled"],
        default: "ongoing",
    },
    shortId: { type: String, unique: true, index: true }, // friendly short ID
}, { timestamps: true });

// Generate shortId before saving if missing
tripSchema.pre("save", function (next) {
    if (!this.shortId) {
        this.shortId = Math.random().toString(36).substring(2, 8); // 6-char ID
    }
    next();
});

export const Trip = mongoose.model("Trip", tripSchema);
