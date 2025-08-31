import express from "express";
import { Vehicle } from "../models/Vehicle.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get all vehicles (optionally owned by user)
router.get("/", protect, async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ userId: req.user._id }).populate("userId");
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single vehicle by shortId
router.get("/:shortId", protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ shortId: req.params.shortId, userId: req.user._id });
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
        res.json(vehicle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create vehicle
router.post("/", protect, async (req, res) => {
    try {
        const vehicle = new Vehicle({
            ...req.body,
            userId: req.user._id, // owner
        });
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update vehicle
router.put("/:shortId", protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            { shortId: req.params.shortId, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found or not yours" });
        res.json(vehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete vehicle
router.delete("/:shortId", protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({ shortId: req.params.shortId, userId: req.user._id });
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found or not yours" });
        res.json({ message: "Vehicle deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
