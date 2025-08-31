import express from "express";
import { Trip } from "../models/Trip.js";
import { Vehicle } from "../models/Vehicle.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ------------------ Get all trips for logged-in user ------------------
router.get("/", protect, async (req, res) => {
    try {
        const trips = await Trip.find({ userId: req.user._id })
            .populate("vehicleId", "make model year plateNumber shortId"); // populate vehicle details
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ------------------ Get a single trip by shortId ------------------
router.get("/:shortId", protect, async (req, res) => {
    try {
        const trip = await Trip.findOne({ shortId: req.params.shortId, userId: req.user._id })
            .populate("vehicleId", "make model year plateNumber shortId");
        if (!trip) return res.status(404).json({ message: "Trip not found" });
        res.json(trip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ------------------ Create a new trip ------------------
router.post("/", protect, async (req, res) => {
    try {
        // Optional: validate vehicle belongs to user
        const { vehicleId } = req.body;
        const vehicle = await Vehicle.findOne({ _id: vehicleId, userId: req.user._id });
        if (!vehicle) return res.status(400).json({ message: "Invalid vehicle for this user" });

        const trip = new Trip({
            ...req.body,
            userId: req.user._id,
        });
        await trip.save();
        const populatedTrip = await trip.populate("vehicleId", "make model year plateNumber shortId");
        res.status(201).json(populatedTrip);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ------------------ Update a trip ------------------
router.put("/:shortId", protect, async (req, res) => {
    try {
        const { vehicleId } = req.body;
        if (vehicleId) {
            const vehicle = await Vehicle.findOne({ _id: vehicleId, userId: req.user._id });
            if (!vehicle) return res.status(400).json({ message: "Invalid vehicle for this user" });
        }

        const trip = await Trip.findOneAndUpdate(
            { shortId: req.params.shortId, userId: req.user._id },
            req.body,
            { new: true }
        ).populate("vehicleId", "make model year plateNumber shortId");

        if (!trip) return res.status(404).json({ message: "Trip not found or not yours" });
        res.json(trip);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ------------------ Delete a trip ------------------
router.delete("/:shortId", protect, async (req, res) => {
    try {
        const trip = await Trip.findOneAndDelete({ shortId: req.params.shortId, userId: req.user._id });
        if (!trip) return res.status(404).json({ message: "Trip not found or not yours" });
        res.json({ message: "Trip deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
