
const express = require("express");
const routes = express.Router();
const authenticationController = require("../Controllers/authenticationController");
const { verifySignUp, verifyLogin } = require("../Helpers/validationSchema");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const tokenAuth = require("../Helpers/tokenAuth");
const verifyAdmin = require("../Helpers/verifyAdmin");

const {
  getUsers,
  getUsersById,
  signUp,
  login,
  updatePassword,
  deleteUser,
  UserData,
  uploadFile,
} = authenticationController;

// Get methods
routes.get("/", getUsers);
routes.get("/:id", getUsersById);
// verifySignUp
// Post methods
routes.post("/signup", signUp);
routes.post("/login", verifyLogin, login);
routes.post("/userData", UserData);

// Patch methods
routes.patch("/update", tokenAuth, updatePassword);

// Delete methods
routes.delete("/", tokenAuth, verifyAdmin, deleteUser);



module.exports = routes;
