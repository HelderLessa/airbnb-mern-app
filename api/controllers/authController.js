import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const jwtSecret = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("User registration failed. Error code:", err.code);

    if (err.code === 11000) {
      return res
        .status(422)
        .json({ message: "This e-mail is already in use!" });
    }

    res.status(500).json({ message: "User registration error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, _id: user._id, name: user.name },
      jwtSecret,
      { expiresIn: "1d" }
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
      })
      .json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const profile = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.json(null);

  jwt.verify(token, jwtSecret, async (err, userData) => {
    if (err) return res.status(401).json({ message: "Invalid token!" });

    const user = await User.findById(userData._id);
    if (!user) return res.status(404).json({ message: "User not!" });

    res.json({ name: user.name, email: user.email, _id: user._id });
  });
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ success: true });
};
