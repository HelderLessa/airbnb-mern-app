import Place from "../models/Place.js";
import { Types } from "mongoose";

export const createPlace = async (req, res) => {
  const userData = req.user;
  const {
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  try {
    const placeDoc = await Place.create({
      owner: userData._id,
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });

    res.status(201).json(placeDoc);
  } catch (err) {
    console.error("Error creating place:", err);
    res.status(500).json({ message: "Error creating place." });
  }
};

export const getUserPlaces = async (req, res) => {
  try {
    const places = await Place.find({ owner: req.user._id });
    res.json(places);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch user's places",
      error: err.message,
    });
  }
};

export const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch places",
      error: err.message,
    });
  }
};

export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json(place);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch place",
      error: err.message,
    });
  }
};

export const updatePlace = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID." });
  }

  try {
    const placeDoc = await Place.findById(id);

    if (!placeDoc) {
      return res.status(404).json({ message: "Place not found." });
    }

    if (placeDoc.owner.toString() !== req.user._id) {
      return res.status(403).json({ message: "You don't have permission." });
    }

    Object.assign(placeDoc, data);
    await placeDoc.save();
    res.json(placeDoc);
  } catch (err) {
    console.error("🔴 Error updating place:", err);
    res.status(500).json({ message: "Internal error updating place." });
  }
};
