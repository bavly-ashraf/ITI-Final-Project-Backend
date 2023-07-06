const mongoose = require("mongoose");
const { Schema } = mongoose;

//Order schema
const OrderSchema = new Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "orderItems",
    },
  ],

  Address: {
    type: String,
    required: [true, "please enter the address"],
  },
  city: {
    type: String,
    required: [true, "please enter the city"],
  },
  zip: {
    type: Number,
    required: [true, "please enter the zip"],
  },
  country: {
    type: String,
    required: [true, "please enter the country"],
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  // status: {
  //   type: String,
  //   enum: statusEnum, // add the enum to the status field
  //   required: true,
  //   default: "Pending",
  // },
  dateOfOrder: {
    type: Date,
    default: Date.now,
  },
  totalPrice: {
    type: Number,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Users",
  },
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
