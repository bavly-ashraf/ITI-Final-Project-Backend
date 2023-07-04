require("dotenv").config();
const AppError = require("../Helpers/AppError");
const User = require("../Models/Users");
const bcrypt = require("bcrypt");
const {
  schema,
  verifySignUp,
  passwordSchema,
} = require("../Helpers/validationSchema");
const jwt = require("jsonwebtoken");

////////////////////////////////////get methods//////////////////////////////////

//http://localhost:8080/users

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    if (users.length == 0) return next(new AppError("Users not found"));
    res.send(users);
  } catch (error) {
    return next(error);
  }
};

//http://localhost:8080/users

const getUsersById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return next(new AppError("User not found"));
    res.send(user);
  } catch (error) {
    return next(error);
  }
};

////////////////////////////////////post methods//////////////////////////////////

//http://localhost:8080/users/signup

const signUp = async (req, res, next) => {
  console.log("signUp");
  try {
    console.log(req.body);
    const { email, username, password, confirmPassword } = req.body;
    console.log(
      "Received user data:",
      email,
      username,
      password,
      confirmPassword
    );

    if (!email || !username || !password || !confirmPassword) {
      console.log("Missing required info");
      return next(new AppError("Please enter the required info"));
    }

    const user = await User.findOne({ email });
    if (user) {
      console.log("User email already exists");
      return next(new AppError("User email already exists"));
    }

    const hashed_password = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      username,
      password: hashed_password,
    });
    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        user: newUser.email,
        roles: newUser.role,
        isLogged: newUser.isLogged,
      },
      process.env.JWT_SECRET
    );

    newUser.password = undefined;
    res.send({ newUser, token });

    console.log("User signed up successfully");
  } catch (error) {
    console.log("Error occurred during signup:", error);
    next(error);
  }
  console.log("End of signUp");
};

const login = async (req, res, next) => {
  console.log("login");

  const { email, password } = req.body;
  console.log("Received login data:", email, password);

  const user = await User.findOne({ email: email });
  if (!user) return next(new AppError("Email or Passwrods isnt correct", 403));

  const token = jwt.sign(
    {
      id: user._id,
      user: user.email,
      roles: user.role,
      isLogged: user.isLogged,
    },
    process.env.JWT_SECRET
  );
  if (!user) return next(new AppError("Email or Passwrods isnt correct", 403));
  const isMatch = await user.checkPassword(password);
  if (!isMatch)
    return next(new AppError("Email or Passwrods isnt correct", 404));
  user.isLogged = true;
  await user.save();
  user.password = undefined;
  // const roles=[2001.1984]
  // res.status(201).json({ roles: ["admin"], message: "sucess", user, token });
  res.status(201).json({ message: "sucess", user, token });

  // if (user) {
  //   const isMatch = await user.checkPassword(password);
  //   if (isMatch) {
  //     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  //     user.password = undefined;
  //     console.log("hey there");
  //     // return res.send({ user, token });
  //     return res.json({ message: "Sucess ", user, token });
  //   } else {
  //     console.log("hey error");
  //     return res.status(401).json({
  //       message: "Incorrect Credentials ,Please make sure to enter the ",
  //     });
  //   }
  // } else {
  //   return next(new AppError("User do not exist", 404));
  // }
};

const getUserDataFromToken = async (decodedToken) => {
  // Retrieve user data from the database or any other source based on the decoded token
  // For example, you can use the decoded token's ID to fetch the corresponding user from the database
  const userId = decodedToken.id;
  const user = await User.findById(userId); // Assuming you have a User model
  console.log("getuserdata", userId);
  // Return the user data
  return user;
};
const UserData = async (req, res, next) => {
  const { token } = req.body;
  console.log(token, req.body);

  try {
    // Verify and decode the token to get the user data and roles
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("hello token");
    // Retrieve user data from the decoded token
    const user = await getUserDataFromToken(decodedToken);
    user.password = undefined;

    // Return the user data and roles in the response
    res.status(200).json({
      user,
      token,
    });
    console.log(user);
    if (!user)
      return next(new AppError("Email or Passwrods isnt correct", 403));
  } catch (error) {
    console.error("Error decoding token:", error);
    res.status(500).json({ error: "Failed to decode token" });
  }
};

////////////////////////////////////patch methods//////////////////////////////////

//http://localhost:8080/users/update

const updatePassword = async (req, res, next) => {
  try {
    const { email, password, newPassword, newPassword_confirm } = req.body;
    if (!email || !password || !newPassword || !newPassword_confirm)
      return next(new AppError("Please enter the required info"));
    const user = await User.findOne({ email: email });
    if (!user) return next(new AppError("user does not exist"));
    const isMatch = await user.checkPassword(password);
    if (!isMatch) return next(new AppError("wrong password"));
    try {
      await passwordSchema.validateAsync({
        password: newPassword,
        password_confirm: newPassword_confirm,
      });
    } catch (err) {
      return next(err);
    }
    user.savePassword(newPassword);
    user.password = undefined;
    res.send(user);
  } catch (error) {
    return next(error);
  }
};

////////////////////////////////////delete methods//////////////////////////////////

//http://localhost:8080/users

// const deleteUser = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     if (!email)
//       return next(
//         new AppError("please enter the email of the user you want to delete")
//       );
//     const user = await User.findOne({ email: email });
//     if (!user) return next(new AppError("user does not exist"));
//     await User.deleteOne({ email: email });

//     await Post.deleteMany({ userId: user._id });
//     await Review.deleteMany({ userId: user._id });

//     res.send("removed user");
//   } catch (error) {
//     return next(error);
//   }
// };////
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.userId;
    if (!userId)
      return next(
        new AppError("Please provide the ID of the user you want to delete")
      );

    // Verify if the requester is an admin
    const admin = await User.findById(req.id);
    if (!admin || admin.role !== "admin") {
      return next(new AppError("Only admins can delete users", 403));
    }

    const user = await User.findById(userId);
    if (!user) return next(new AppError("User does not exist"));

    await User.deleteOne({ _id: userId });
    await Post.deleteMany({ userId: user._id });
    await Review.deleteMany({ userId: user._id });

    res.send("User removed");
  } catch (error) {
    return next(error);
  }
};

////////////////////////////
const Logout = async (req, res, next) => {
  const idd = req.userId;
  console.log(idd);

  // Find the user by ID

  const user = await User.findById(idd); // Assuming you have a User model
  console.log("hello from after");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isLogged = false;
  await user.save();
  console.log(user.isLogged);
  res.status(200).json({ message: "Logout successful" });
};

//////////////////////////////////////////////////
//Adress
const setAddress = async (req, res, next) => {
  try {
    const { address } = req.body;
    const userId = req.userId;

    // Update the user's address in the database
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Update the user's address fields with the new values
    user.address.apartment = address.apartment;
    user.address.floor = address.floor;
    user.address.buildingNo = address.buildingNo;
    user.address.street = address.street;
    user.address.zip = address.zip;
    user.address.city = address.city;
    user.address.country = address.country;

    await user.save();

    res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUsersById,
  signUp,
  login,
  updatePassword,
  deleteUser,
  UserData,
  Logout,
  setAddress,
};
