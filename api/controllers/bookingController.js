import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(booking);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create booking", error: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "place"
    );
    res.json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("place");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this booking" });
    }

    res.json(booking);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching booking", error: err.message });
  }
};
