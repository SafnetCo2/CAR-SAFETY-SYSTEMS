import mongoose from 'mongoose';


const alertSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    type: { type: String, enum: ['speeding', 'geofence', 'harsh_brake'], required: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    note: String,
    at: { lat: Number, lng: Number },
    occurredAt: { type: Date, default: () => new Date() }
}, { timestamps: true });


export const Alert = mongoose.model('Alert', alertSchema);