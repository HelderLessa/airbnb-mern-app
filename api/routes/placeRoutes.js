import express from "express";
import {
  createPlace,
  getUserPlaces,
  getAllPlaces,
  getPlaceById,
  updatePlace,
} from "../controllers/placeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPlace);
router.get("/user-places", authMiddleware, getUserPlaces);
router.get("/", getAllPlaces);
router.get("/:id", getPlaceById);
router.put("/:id", authMiddleware, updatePlace);

export default router;
