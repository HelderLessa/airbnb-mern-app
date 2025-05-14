import dotenv from "dotenv";
import jwt from "jsonwebtoken";
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error("JWT_SECRET está undefined!");
}

export default function authMiddleware(req, res, next) {
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token not provided" });

  jwt.verify(token, jwtSecret, (err, userData) => {
    if (err) {
      console.error("Token inválido:", err.message);
      return res.status(401).json({ message: "Invalid token!" });
    }
    req.user = userData;
    next();
  });
}
