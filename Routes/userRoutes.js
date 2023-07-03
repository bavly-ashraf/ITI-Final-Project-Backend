
// const express = require("express");
// const routes = express();
// const {
//   getUsers,
//   getUsersById,
//   signUp,
//   login,
//   updatePassword,
//   deleteUser,
//   uploadFile,
// } = require("../Controllers/authenticationController");
// const { verifySignUp } = require("../Helpers/validationSchema");
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// const verifyToken = require("../Helpers/tokenAuth");
// const verifyAdmin = require("../Helpers/verifyAdmin");

// //////////get methods///////////

// routes.get("/", getUsers);

// routes.get("/:id", getUsersById);

// //////////post methods///////////
// // verifySignUp
// routes.post("/signup", signUp);

// routes.post("/login", login);

// // routes.post('/upload',verifyToken,upload.single('photo'),uploadFile);

// //////////patch methods///////////

// routes.patch("/update", verifyToken, updatePassword);

// //////////delete methods///////////

// routes.delete("/", verifyToken, verifyAdmin, deleteUser);

// routes.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   res.status(statusCode).send({
//     status: statusCode,
//     message: err?.message || "internal server error",
//     errors: err?.errors || [],
//   });
// });

// module.exports = routes;
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

// routes.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   res.status(statusCode).send({
//     status: statusCode,
//     message: err?.message || "Internal server error",
//     errors: err?.errors || [],
//   });
// });

module.exports = routes;
