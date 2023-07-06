const express = require("express");
const routes = express.Router();
const authenticationController = require("../Controllers/authenticationController");
const { verifySignUp, verifyLogin } = require("../Helpers/validationSchema");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const tokenAuth = require("../Helpers/tokenAuth");
const verifyAdmin = require("../Helpers/verifyAdmin");
const verifyToken = require("../Helpers/tokenAuth");

const {
  getUsers,
  getUsersById,
  signUp,
  login,
  updatePassword,
  deleteUser,
  UserData,
  Logout,
  setAddress,
  updateUser,
  uploadFile,
} = authenticationController;

// Get methods
routes.get("/", tokenAuth, verifyAdmin, getUsers);
routes.get("/:id", getUsersById);
// verifySignUp
// Post methods
routes.post("/signup", verifySignUp, signUp);
routes.post("/login", verifyLogin, login);
routes.post("/userData", UserData);
routes.post("/logout", verifyToken, Logout);
routes.post("/setadress", verifyToken, setAddress);

// Patch methods
routes.patch("/update", tokenAuth, updateUser);

// Delete methods
routes.delete("/deleteuser", tokenAuth, deleteUser);

module.exports = routes;
