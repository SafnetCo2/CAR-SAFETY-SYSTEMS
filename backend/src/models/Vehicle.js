import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        make: { type: String, required: true },
        model: { type: String, required: true },
        year: { type: Number },
        vin: { type: String },
        shortId: { type: String, unique: true, index: true }, // shortId field
    },
    { timestamps: true }
);

// Generate shortId before saving if missing
vehicleSchema.pre("save", function (next) {
    if (!this.shortId) {
        this.shortId = Math.random().toString(36).substring(2, 8); // 6-char shortId
    }
    next();
});

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
