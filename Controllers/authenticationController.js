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

// const signUp = async (req, res, next) => {
//   try {
//     const { email, username, role, password, password_confirm } = req.body;
//     if (!email || !username || !role || !password || !password_confirm)
//       return next(new AppError("Please enter the required info"));
//     const user = await User.findOne({ email });
//     if (user) {
//       return next(new AppError("user email already exists"));
//     } else {
//       const hashed_password = await bcrypt.hash(password, 10);
//       const newUser = new User({
//         email,
//         username,
//         role,
//         password: hashed_password,
//       });
//       await newUser.save();
//       const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

//       newUser.password = undefined;
//       res.send({ newUser, token });
//     }
//   } catch (error) {
//     return next(error);
//   }
// };
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

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    newUser.password = undefined;
    res.send({ newUser, token });

    console.log("User signed up successfully");
  } catch (error) {
    console.log("Error occurred during signup:", error);
    next(error);
  }
  console.log("End of signUp");
};

//http://localhost:8080/users/login

// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     console.log("Received login data:", email, password);

//     if (!email || !password)
//       return next(new AppError("Please enter the required info"));

//     const user = await User.findOne({ email: email });
//     if (user) {
//       const isMatch = await user.checkPassword(password);
//       if (!isMatch) return next(new AppError("Wrong password"));

//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//       user.password = undefined;
//       res.send({ user, token });
//     } else {
//       return next(new AppError("User does not exist"));
//     }
//   } catch (error) {
//     console.error("An error occurred during login:", error);
//     return next(error);
//   }
// };

// if (user) {
//   const isMatch = await user.checkPassword(password);
//   if (!isMatch) return next(new AppError("Wrong password"));

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//   user.password = undefined;
//   res.send({ user, token });
// } else {
//   return next(new AppError("User does not exist"));
// }
const login = async (req, res, next) => {
  console.log("login");

  const { email, password } = req.body;
  console.log("Received login data:", email, password);

  const user = await User.findOne({ email: email });
  // const token = jwt.sign(
  //   { id: user._id, isLogged: user.islogged },
  //   process.env.JWT_SECRET
  // );
  const token = jwt.sign(
    {
      id: user._id,
      // user: user.email,
      // roles: user.roles,
    },
    process.env.JWT_SECRET
  );
  if (!user) return next(new AppError("Email or Passwrods isnt correct", 403));
  const isMatch = await user.checkPassword(password);
  if (!isMatch)
    return next(new AppError("Email or Passwrods isnt correct", 404));
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
//////////////////////////////////////////////
// const UserData = async (req, res, next) => {
//   const { token } = req.body;
//   console.log(token, req.body);

//   try {
//     // Verify and decode the token to get the user data and roles
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

//     // Retrieve user data from the decoded token (e.g., from the database)
//     const user = getUserDataFromToken(decodedToken);

//     // Return the user data and roles in the response
//     res.status(200).json({
//       user,
//       roles: user.roles,
//     });
//   } catch (error) {
//     console.error("Error decoding token:", error);
//     res.status(500).json({ error: "Failed to decode token" });
//   }
// };
const getUserDataFromToken = async (decodedToken) => {
  // Retrieve user data from the database or any other source based on the decoded token
  // For example, you can use the decoded token's ID to fetch the corresponding user from the database
  const userId = decodedToken.id;
  const user = await User.findById(userId); // Assuming you have a User model

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

const deleteUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email)
      return next(
        new AppError("please enter the email of the user you want to delete")
      );
    const user = await User.findOne({ email: email });
    if (!user) return next(new AppError("user does not exist"));
    await User.deleteOne({ email: email });

    await Post.deleteMany({ userId: user._id });
    await Review.deleteMany({ userId: user._id });

    res.send("removed user");
  } catch (error) {
    return next(error);
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
};
