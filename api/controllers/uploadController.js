import { cloudinary } from "../config/cloudinary.js"; // ou onde estiver sua config
import axios from "axios";

export const uploadByLink = async (req, res) => {
  const { link } = req.body;
  try {
    const uploaded = await cloudinary.uploader.upload(link);
    res.json({ url: uploaded.secure_url });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Upload by link error.", error: err.message });
  }
};
