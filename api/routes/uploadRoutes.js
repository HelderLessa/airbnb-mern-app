import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import { uploadByLink } from "../controllers/uploadController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const upload = multer({ storage });
const router = express.Router();

router.post("/upload-by-link", authMiddleware, uploadByLink);
router.post("/upload", upload.array("photos", 100), (req, res) => {
  const urls = req.files.map((file) => file.path);
  res.json(urls);
});

export default router;
