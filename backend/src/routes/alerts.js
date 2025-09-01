import express from "express";
import { Alert } from "../models/Alert.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ------------------ GET ALL ALERTS (ADMIN ONLY) ------------------
router.get("/", protect, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    try {
        const alerts = await Alert.find()
            .populate("userId vehicleId tripId", "-password")
            .sort({ occurredAt: -1 });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ------------------ GET ALERT BY ID ------------------
router.get("/:id", protect, async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id)
            .populate("userId vehicleId tripId", "-password");
        if (!alert) return res.status(404).json({ message: "Alert not found" });

        // Users can only access their own alerts
        if (req.user.role !== "admin" && alert.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(alert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ------------------ CREATE ALERT ------------------
router.post("/", protect, async (req, res) => {
    try {
        const { vehicleId, tripId, type, severity, note, at, occurredAt } = req.body;
        const alert = new Alert({
            userId: req.user._id,
            vehicleId,
            tripId,
            type,
            severity,
            note,
            at,
            occurredAt,
        });
        await alert.save();
        res.status(201).json(alert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ------------------ UPDATE ALERT ------------------
router.put("/:id", protect, async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);
        if (!alert) return res.status(404).json({ message: "Alert not found" });

        if (req.user.role !== "admin" && alert.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        Object.assign(alert, req.body);
        await alert.save();
        res.json(alert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ------------------ DELETE ALERT ------------------
router.delete("/:id", protect, async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);
        if (!alert) return res.status(404).json({ message: "Alert not found" });

        if (req.user.role !== "admin" && alert.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        await alert.remove();
        res.json({ message: "Alert deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
