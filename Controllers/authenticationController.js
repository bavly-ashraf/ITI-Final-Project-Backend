require("dotenv").config();
const AppError = require("../Helpers/AppError");
const User = require("../Models/Users");
const Products = require("../Models/Products");
const { sendVerificationEmail } = require("../Services/sendVerificationEmail");

const bcrypt = require("bcrypt");
const { passwordSchema } = require("../Helpers/validationSchema");
const jwt = require("jsonwebtoken");

////////////////////////////////////get methods//////////////////////////////////

//http://localhost:8080/users

const getUsers = async (req, res, next) => {
  try {
    // Verify if the requester is an admin
    const admin = await User.findById(req.id);
    if (admin.role !== "admin")
      return next(new AppError("Only admins can access user data", 403));
    const users = await User.find({}, "-password"); // Exclude the password field from the response
    res.status(200).send(users);
  } catch (error) {
    return next(error);
  }
};

//http://localhost:8080/users/id
const getUsersById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).send(user);
  } catch (error) {
    return next(error);
  }
};
////////////////////////////////////post methods//////////////////////////////////
//http://localhost:8080/users/signup
// const signUp = async (req, res, next) => {
//   try {
//     const { email, username, role, password, confirmPassword } = req.body;
//     if (!email || !username || !password || !confirmPassword)
//       return next(new AppError("Please enter the required info"));
//     const user = await User.findOne({ email });
//     if (user) return next(new AppError("User email already exists"));
//     const hashed_password = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       email,
//       role,
//       username,
//       password: hashed_password,
//     });
//     await newUser.save();
//     const token = jwt.sign(
//       {
//         id: newUser._id,
//         user: newUser.email,
//         roles: newUser.role,
//         isLogged: newUser.isLogged,
//       },
//       process.env.JWT_SECRET
//     );
//     newUser.password = undefined;
//     res.status(201).json({ newUser, token });
//   } catch (error) {
//     next(error);
//   }
// };
//////////////////////////////////////////////
// const verifyEmail = async (req, res, next) => {
//   try {
//     const { email, verificationCode } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return next(new AppError("User not found", 404));
//     if (user.verification.code !== verificationCode) {
//       return res.status(400).json({ message: "Invalid verification code" });
//     }
//     // Mark the email as verified
//     user.verification.verified = true;
//     await user.save();
//     res.status(200).json({ message: "Email verified successfully" });
//   } catch (error) {
//     next(error);
//   }
// };
// const generateVerificationCode = () => {
//   const code = Math.random().toString(36).substring(2, 8); // Generate a random alphanumeric code
//   return code;
// };
// const signUp = async (req, res, next) => {
//   try {
//     const { email, username, role, password, confirmPassword } = req.body;
//     if (!email || !username || !password || !confirmPassword)
//       return next(new AppError("Please enter the required info"));

//     const user = await User.findOne({ email });
//     if (user) return next(new AppError("User email already exists"));

//     const hashed_password = await bcrypt.hash(password, 10);

//     const verificationCode = generateVerificationCode(); // Generate a verification code

//     const newUser = new User({
//       email,
//       role,
//       username,
//       password: hashed_password,
//       verification: {
//         code: verificationCode,
//         verified: false,
//       },
//     });

//     await newUser.save();

//     const token = jwt.sign(
//       {
//         id: newUser._id,
//         user: newUser.email,
//         roles: newUser.role,
//         isLogged: newUser.isLogged,
//       },
//       process.env.JWT_SECRET
//     );

//     newUser.password = undefined;
//     res.status(201).json({ newUser, token });
//   } catch (error) {
//     next(error);
//   }
// };
// const verifyEmail = async (req, res, next) => {
//   try {
//     console.log("verufy enau");
//     const { email, Verification_code } = req.body;

//     const user = await User.findOne({ email });

//     // if (!user) return res.status(404).json({ message: "User not found" });
//     if (!user) return next(new AppError("User not found", 403));

//     if (user.verification.code !== Verification_code) {
//       return res.status(400).json({ message: "Invalid verification code" });
//     }

//     console.log("dwadw");
//     // Mark the email as verified
//     user.verification.verified = true;
//     await user.save();
//     res.status(200).json({ message: "Email verified successfully" });
//   } catch (error) {
//     next(error);
//   }
// };
const verifyEmail = async (req, res, next) => {
  try {
    console.log("verify email");
    const { email, Verification_code } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (user.verification.code !== Verification_code) {
      return next(new AppError("Invalid verification code", 400));
    }

    user.verification.verified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

const generateVerificationCode = () => {
  const code = Math.random().toString(36).substring(2, 8); // Generate a random alphanumeric code
  return code;
};

const signUp = async (req, res, next) => {
  try {
    const { email, username, password, confirmPassword } = req.body;
    if (!email || !username || !password || !confirmPassword)
      return res
        .status(400)
        .json({ message: "Please enter the required info" });

    const user = await User.findOne({ email });
    console.log(user);
    if (user)
      return res.status(400).json({ message: "User email already exists" });
    console.log("hello world23232");

    const hashed_password = await bcrypt.hash(password, 10);

    const verificationCode = generateVerificationCode(); // Generate a verification code

    const newUser = new User({
      email,
      username,
      password: hashed_password,
      verification: {
        code: verificationCode,
        verified: false,
      },
    });

    await newUser.save();

    // Send the verification email
    console.log("hello world");

    await sendVerificationEmail(email, verificationCode);

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
    res.status(201).json({ newUser, token });
  } catch (error) {
    next(error);
  }
};

//////////////////////Login////////////////////
//http://localhost:3000/users/login

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) return next(new AppError("Email or Passwrods isnt correct", 403));
  console.log(user.verification.verified);
  if (user.verification.verified == false)
    return next(new AppError("please verify your account", 403));

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
  res.status(201).json({ message: "sucess", user, token });
};

const getUserDataFromToken = async (decodedToken) => {
  const userId = decodedToken.id;
  const user = await User.findById(userId);
  return user;
};
const UserData = async (req, res, next) => {
  const { token } = req.body;
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserDataFromToken(decodedToken);
    res.status(200).json({
      user,
      token,
    });
    if (!user)
      return next(new AppError("Email or Passwrods isnt correct", 403));
  } catch (error) {
    res.status(500).json({ error: "Failed to decode token" });
  }
};

////////////////////////////////////patch methods//////////////////////////////////
//http://localhost:8080/users/update

const updatePassword = async (req, res, next) => {
  try {
    const { email, password, newPassword, newPassword_confirm } = req.body;
    if (!email || !password || !newPassword || !newPassword_confirm)
      return next(new AppError("Please enter the required info", 404));
    const user = await User.findOne({ email: email });
    if (!user) return next(new AppError("user does not exist", 404));
    const isMatch = await user.checkPassword(password);
    if (!isMatch) return next(new AppError("wrong password", 404));
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

////////////////////////////////////////////
const updateUser = async (req, res, next) => {
  try {
    const userId = req.id;
    const updatedData = req.body;
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found"));
    Object.assign(user, updatedData);
    await user.save();
    res.send(user);
  } catch (error) {
    return next(error);
  }
};

////////////////////////////////////delete methods//////////////////////////////////

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId)
      return next(
        new AppError(
          "Please provide the ID of the user you want to delete",
          404
        )
      );
    // Verify if the requester is an admin
    const admin = await User.findById(req.id);
    if (admin.role !== "admin")
      return next(new AppError("Only admins can delete users", 403));
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User does not exist"), 404);
    await User.deleteOne({ _id: userId });
    //     await Orders.deleteMany({ userId: user._id });
    //     await Review.deleteMany({ userId: user._id });
    res.send("User removed");
  } catch (error) {
    return next(error);
  }
};

////////////////////////////
const Logout = async (req, res, next) => {
  const idd = req.id;
  // Find the user by ID
  const user = await User.findById(idd); // Assuming you have a User model
  if (!user) return next(new AppError("user not found", 404));
  user.isLogged = false;
  await user.save();
  res.status(200).json({ message: "Logout successful" });
};

//////////////////////////////////////////////////
//Adress
const setAddress = async (req, res, next) => {
  try {
    const { address } = req.body;
    const userId = req.id;
    // Update the user's address in the database
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    // Update the user's address fields with the new values
    const { apartment, floor, buildingNo, street, zip, city, country } =
      user.address;
    apartment = address.apartment;
    floor = address.floor;
    buildingNo = address.buildingNo;
    street = address.street;
    zip = address.zip;
    city = address.city;
    country = address.country;
    await user.save();
    res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    next(error);
  }
};
//////////////////////////////All in one method if cound =0 it will renmve the product ,to make it easier instead of using two separate methods
///there is update too if the count is diffrent
//        127.0.0.1:3000/users/addtocart
// {
//   "productId": "64a86b19bb0571693c055d18",
//   "count": 5
// }
//case 1 if the product exists it will update its count ,if not it will make a new one
/////////////////
// {
//   "productId": "64a86b19bb0571693c055d18",
//   "count": 0
// }
//this will remove the product

const addToCart = async (req, res, next) => {
  try {
    const { productId, count } = req.body;
    const userId = req.id;
    // Find the user by ID
    const user = await User.findById(userId);
    // Check if the user exists
    if (!user) return next(new AppError("User not found", 404));
    // productId;
    const productExists = await Products.findById(productId);
    if (!productExists) return next(new AppError("Product not found", 404));
    // Find the cart item with the matching productId
    const existingCartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );
    if (count === 0) {
      // Remove the cart item from the user's cart
      user.cart = user.cart.filter(
        (item) => item.productId.toString() !== productId
      );
      await user.save();

      return res
        .status(200)
        .json({ message: "Product deleted from cart  successfully" });
    }
    if (existingCartItem) {
      // Update the quantity of the existing cart item
      existingCartItem.quantity = count;
      await user.save();

      return res.status(200).json({ message: "Qunatity updated" });
    } else {
      // Create a new cart item
      const cartItem = {
        productId: productId,
        quantity: count,
      };

      // Add the cart item to the user's cart
      user.cart.push(cartItem);
      await user.save();

      return res
        .status(200)
        .json({ message: "Product added to cart successfully" });
    }

    // Save the user's updated cart
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
  addToCart,
  setAddress,
  updateUser,
  verifyEmail,
};
