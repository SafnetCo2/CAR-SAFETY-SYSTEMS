import express from "express";
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";
import tripRoutes from "./tripRoute.js";
import vehicleRoutes from "./vehicleRoutes.js";

const router = express.Router();

router.use("/user", userRoutes);  // <-- dedicated user routes
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/trip", tripRoutes);
router.use("/vehicle", vehicleRoutes);

export default router;
