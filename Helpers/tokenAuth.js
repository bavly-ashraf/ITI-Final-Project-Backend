
const jwt = require("jsonwebtoken");
const AppError = require("../Helpers/AppError");
const User = require("../Models/Users");
require("dotenv").config();

const verifyToken = async (req, res, next) => {

  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(new AppError("Please provide a token", 401));
    }
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);

    const id = decoded.id;
    req.authorizedUser = await User.findById(id);
    if (!req.authorizedUser) {
      return next(new AppError("User not found or invalid token", 401));
    }
    req.id = id;
    next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
};


module.exports = verifyToken;
