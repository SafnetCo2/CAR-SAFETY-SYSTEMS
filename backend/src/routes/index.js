import express from "express";
import authRoutes from "./authRoutes.js"
import adminRoutes from "./adminRoutes.js";
import tripRoutes from "./tripRoute.js";
import vehicleRoutes from "./vehicleRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/trip", tripRoutes);
router.use("/vehicles", vehicleRoutes);


export default router;
