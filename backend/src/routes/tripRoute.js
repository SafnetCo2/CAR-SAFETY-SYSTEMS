import express from "express";
import { Trip } from "../models/Trip.js";

const router = express.Router();

// ✅ Create Trip
router.post("/", async (req, res) => {
    try {
        const trip = new Trip(req.body);
        // Generate a shortId if not present
        if (!trip.shortId) {
            trip.shortId = Math.random().toString(36).substring(2, 8);
        }
        await trip.save();
        res.status(201).json(trip);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Get All Trips
router.get("/", async (req, res) => {
    try {
        const trips = await Trip.find().populate("userId vehicleId");
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Get Trip by shortId
router.get("/:shortId", async (req, res) => {
    try {
        const trip = await Trip.findOne({ shortId: req.params.shortId }).populate("userId vehicleId");
        if (!trip) return res.status(404).json({ message: "Trip not found" });
        res.json(trip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Update Trip by shortId
router.put("/:shortId", async (req, res) => {
    try {
        const trip = await Trip.findOneAndUpdate(
            { shortId: req.params.shortId },
            req.body,
            { new: true }
        );
        if (!trip) return res.status(404).json({ message: "Trip not found" });
        res.json(trip);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Delete Trip by shortId
router.delete("/:shortId", async (req, res) => {
    try {
        const trip = await Trip.findOneAndDelete({ shortId: req.params.shortId });
        if (!trip) return res.status(404).json({ message: "Trip not found" });
        res.json({ message: "Trip deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
