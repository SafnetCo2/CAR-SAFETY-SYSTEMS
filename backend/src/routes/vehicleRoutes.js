// vehicleRoutes.js
import express from "express";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();


// CREATE a vehicle
router.post("/", async (req, res) => {
    try {
        const vehicle = new Vehicle(req.body);
        const savedVehicle = await vehicle.save();
        res.status(201).json(savedVehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// READ all vehicles
router.get("/", async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// READ vehicle by shortId
router.get("/:shortId", async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ shortId: req.params.shortId });
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
        res.json(vehicle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// UPDATE vehicle by shortId
router.put("/:shortId", async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            { shortId: req.params.shortId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
        res.json(vehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// DELETE vehicle by shortId
router.delete("/:shortId", async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({ shortId: req.params.shortId });
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
        res.json({ message: "Vehicle deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router;
