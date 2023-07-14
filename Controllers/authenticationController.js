require("dotenv").config();
const AppError = require("../Helpers/AppError");
const User = require("../Models/Users");
const Products = require("../Models/Products");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../Services/sendVerificationEmail");

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
//////////////////////////////////////////
//http://localhost:8080/users/getuser

const getUserbyToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.id);
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).send(user);
  } catch (error) {
    return next(error);
  }
};
////////////////////////////////////post methods//////////////////////////////////

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
      // return res
      //   .status(400)
      //   .json({ message: "Please enter the required info" });
      return next(new AppError("Please enter the required info"));

    const user = await User.findOne({ email });
    console.log(user);
    if (user) return next(new AppError("User email already exists"));

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
///////////////////////////////

//////////////////////Login////////////////////
//http://localhost:3000/users/login
const crypto = require("crypto");

// Encrypt the refresh token
const encryptRefreshToken = (refreshToken) => {
  const algorithm = "aes-256-cbc";
  const key =
    process.env.REFRESH_TOKEN_ENCRYPTION_KEY || "defaultEncryptionKey";
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedRefreshToken = cipher.update(refreshToken, "utf8", "hex");
  encryptedRefreshToken += cipher.final("hex");

  return `${iv.toString("hex")}:${encryptedRefreshToken}`;
};

// Decrypt the refresh token
const decryptRefreshToken = (encryptedRefreshToken) => {
  const algorithm = "aes-256-cbc";
  const key =
    process.env.REFRESH_TOKEN_ENCRYPTION_KEY || "defaultEncryptionKey";

  const [ivHex, encryptedToken] = encryptedRefreshToken.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decryptedRefreshToken = decipher.update(encryptedToken, "hex", "utf8");
  decryptedRefreshToken += decipher.final("utf8");

  return decryptedRefreshToken;
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(new AppError("Email or Password is incorrect", 403));

    if (!user.verification.verified)
      return next(new AppError("Please verify your account", 403));

    const isMatch = await user.checkPassword(password);
    if (!isMatch)
      return next(new AppError("Email or Password is incorrect", 403));
    user.isLogged = true;

    const token = jwt.sign(
      {
        id: user._id,
        user: user.email,
        roles: user.role,
        isLogged: user.isLogged,
      },
      process.env.JWT_SECRET,
      { expiresIn: "5s" }
    );
    const refreshToken = jwt.sign(
      {
        id: user._id,
        user: user.email,
        roles: user.role,
        isLogged: user.isLogged,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );
    const securedToken = jwt.sign(
      {
        id: user._id,
        user: user.email,
        roles: user.role,
        isLogged: user.isLogged,
      },
      process.env.JWT_SECURE_SECRET,
      { expiresIn: "5s" }
    );
    console.log("test", securedToken);
    const encryptedRefreshToken = encryptRefreshToken(securedToken);
    user.refresh_token = encryptedRefreshToken;
    await user.save();

    user.password = undefined;

    res.status(201).json({
      message: "Success",
      user,
      token,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};
const getUserDataFromToken = async (decodedToken) => {
  const userId = decodedToken.id;
  const user = await User.findById(userId);
  return user;
};

// const UserData = async (req, res, next) => {
//   const { refreshToken: frontEndRefreshToken } = req.body;

//   try {
//     // Verify the refresh token from the front-end
//     const decodedRefreshToken = jwt.verify(
//       frontEndRefreshToken,
//       process.env.JWT_REFRESH_SECRET
//     );

//     const userId = decodedRefreshToken.id;

//     // Find the user based on the decoded user ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(401).json({ error: "Invalid refresh token" });
//     }

//     const encryptedRefreshToken = user.refresh_token;
//     const decryptedRefreshToken = decryptRefreshToken(encryptedRefreshToken);

//     const checkbackEndtoken = jwt.verify(
//       decryptedRefreshToken,
//       process.env.JWT_SECURE_SECRET
//     );

//     // Check if the refresh token has expired

//     // Issue a new access token
//     const newAccessToken = jwt.sign(
//       {
//         id: user._id,
//         user: user.email,
//         roles: user.role,
//         isLogged: user.isLogged,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "5m" }
//     );

//     res.status(200).json({ user, token: newAccessToken });
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ error: "Access token has expired" });
//     } else if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({ error: "Invalid refresh token" });
//     }

//     res.status(500).json({ error: "Failed to decode token" });
//   }
// };
const UserData = async (req, res, next) => {
  const { refreshtoken } = req.body;
  console.log(req.body);
  console.log(refreshtoken);
  try {
    // Verify the refresh token from the front-end
    const decodedRefreshToken = jwt.verify(
      refreshtoken,
      process.env.JWT_REFRESH_SECRET
    );

    const userId = decodedRefreshToken.id;
    console.log(userId);
    // Find the user based on the decoded user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const encryptedRefreshToken = user.refresh_token;
    const decryptedRefreshToken = decryptRefreshToken(encryptedRefreshToken);
    console.log("test22", decryptedRefreshToken);
    // Verify the decrypted refresh token with the JWT_SECURE_SECRET
    const secureTokenVerificationResult = jwt.verify(
      decryptedRefreshToken,
      process.env.JWT_SECURE_SECRET
      // { ignoreExpiration: true }
    );
    console.log("helloanfwnfa");
    // Check if the verification succeeded
    if (secureTokenVerificationResult) {
      // Issue a new access token
      const newAccessToken = jwt.sign(
        {
          id: user._id,
          user: user.email,
          roles: user.role,
          isLogged: user.isLogged,
        },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
      );

      return res.status(200).json({ user, token: newAccessToken });
    } else {
      return res.status(401).json({ error: "Invalid JWT_SECURE_SECRET token" });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Access token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

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
////////////////////////

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const resetCode = generateVerificationCode(); // Generate a password reset code
    user.verification.code = resetCode; // Store the reset code in the user's record
    await user.save();
    console.log(email, resetCode); //
    // Send the password reset email
    await sendPasswordResetEmail(email, resetCode); // You can reuse the existing email sending function
    console.log("hello");
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, password, Verification_code } = req.body;
    console.log(email, password, Verification_code);
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    console.log(user);
    // Check if the reset code matches the one stored in the user's record
    if (user.verification.code !== Verification_code) {
      return next(new AppError("Invalid reset code", 400));
    }

    // Reset the password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordCode = undefined; // Clear the reset code
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
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
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    user.address = {
      apartment: address.apartment,
      floor: address.floor,
      buildingNo: address.buildingNo,
      street: address.street,
      zip: address.zip,
      city: address.city,
      country: address.country,
    };

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
  forgotPassword,
  verifyEmail,
  resetPassword,
  getUserbyToken,
};
