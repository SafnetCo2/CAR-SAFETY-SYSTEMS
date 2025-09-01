import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./user.js";
import tripRoutes from "./trips.js";
import vehicleRoutes from "./vehicles.js";
import alertRoutes from "./alerts.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/trips", tripRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/alerts", alertRoutes);

export default router;
