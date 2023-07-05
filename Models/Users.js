const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const UsersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
  },
  username: {
    type: String,
    required: [true, "Please enter a username"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    // required: [true, "Please enter a role"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    selected: false,
  },
  isLogged: {
    type: Boolean,
    default: "false",
  },
  address: {
    apartment: {
      type: String,
      default: "",
    },
    floor: {
      type: String,
      default: "",
    },
    buildingNo: {
      type: String,
      default: "",
    },
    street: {
      type: String,
      default: "",
    },
    zip: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
  },
  phone: {
    type: String,
    default: "",
  },
  wishList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ordered Items",
    },
  ],
  reviewId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  ordersId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

UsersSchema.methods.savePassword = async function (password) {
  const hashed_password = await bcrypt.hash(password);
  this.password = hashed_password;
};

UsersSchema.methods.checkPassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

const User = mongoose.model("User", UsersSchema);
module.exports = User;
