import express from "express";
import { Trip } from "../models/Trip.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ------------------ GET ALL TRIPS (ADMIN ONLY) ------------------
router.get("/", protect, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    try {
        const trips = await Trip.find().populate("userId vehicleId", "-password");
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ------------------ GET SINGLE TRIP BY ID ------------------
router.get("/:id", protect, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate("userId vehicleId", "-password");
        if (!trip) return res.status(404).json({ message: "Trip not found" });
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ------------------ CREATE TRIP ------------------
router.post("/", protect, async (req, res) => {
    try {
        const { userId, vehicleId, startLocation, endLocation, startTime, endTime, status } = req.body;
        const trip = new Trip({ userId, vehicleId, startLocation, endLocation, startTime, endTime, status });
        await trip.save();
        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ------------------ UPDATE TRIP ------------------
router.put("/:id", protect, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: "Trip not found" });

        if (req.user.role !== "admin" && trip.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        Object.assign(trip, req.body);
        await trip.save();
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ------------------ DELETE TRIP ------------------
router.delete("/:id", protect, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: "Trip not found" });

        if (req.user.role !== "admin" && trip.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        await trip.remove();
        res.json({ message: "Trip deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
