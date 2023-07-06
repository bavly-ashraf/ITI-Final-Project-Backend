const jwt = require("jsonwebtoken");
const AppError = require("../Helpers/AppError");
const User = require("../Models/Users");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return next(new AppError("Please provide a token", 401));
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    const id = decoded.id;
    // console.log("Decoded token ID:", id);
    req.authorizedUser = await User.findById(id);
    if (!req.authorizedUser)
      return next(new AppError("User not found or invalid token", 401));
    req.id = id; // Renamed from req.id to req.userId for clarity
    console.log("Decoded token userId:", req.id);
    console.log("Decoded token user:", decoded.user);
    console.log("Decoded token roles:", decoded.roles);
    console.log("Decoded token isLogged:", decoded.isLogged);
    next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
};

module.exports = verifyToken;
