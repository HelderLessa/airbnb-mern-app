import express from "express";
import authRoutes from "./authRoutes.js";
import placeRoutes from "./placeRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import uploadRoutes from "./uploadRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/places", placeRoutes);
router.use("/bookings", bookingRoutes);
router.use("/api", uploadRoutes);

export default router;
