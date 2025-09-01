import express from "express";
import { Vehicle } from "../models/Vehicle.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ------------------ GET ALL VEHICLES (ADMIN ONLY) ------------------
router.get("/", protect, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    try {
        const vehicles = await Vehicle.find().populate("userId", "-password");
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ------------------ GET SINGLE VEHICLE ------------------
router.get("/:id", protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate("userId", "-password");
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ------------------ CREATE VEHICLE ------------------
router.post("/", protect, async (req, res) => {
    try {
        const { userId, make, model, year, vin } = req.body;
        const vehicle = new Vehicle({ userId, make, model, year, vin });
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ------------------ UPDATE VEHICLE ------------------
router.put("/:id", protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

        if (req.user.role !== "admin" && vehicle.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        Object.assign(vehicle, req.body);
        await vehicle.save();
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ------------------ DELETE VEHICLE ------------------
router.delete("/:id", protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

        if (req.user.role !== "admin" && vehicle.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        await vehicle.remove();
        res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
