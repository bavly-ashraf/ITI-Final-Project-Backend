require("dotenv").config();
const AppError = require("../Helpers/AppError");
const Order = require("../Models/Order");
const User = require("../Models/Users");

const getAllOrders = async (req, res, next) => {
  const user = await User.findById(req.id);
  console.log(user);
  if (user.role !== "admin") return next(new AppError("unauthorized", 403));
  const orders = await Order.find()
    .populate([{ path: "userId", select: "_id username role" }])
    .sort({ dateOfOrder: -1 });
  res.status(200).json({ message: "success", orders });
};

const getOrderById = async (req, res, next) => {
  const foundedOrder = await Order.findById(req.params.id).populate([
    { path: "userId", select: "_id username" },
  ]);
  if (!foundedOrder) return next(new AppError("orders not found", 404));
  res.status(200).json({ message: "success", foundedOrder });
};

const addOrder = async (req, res, next) => {
  const { orderItems, Address, city, zip, country, phone, totalPrice } =
    req.body;
  const order = await Order.create({
    orderItems,
    Address,
    city,
    zip,
    country,
    phone,
    totalPrice,
    userId: req.userId,
  });
  res.status(201).json({ message: "success", order });
};

const getUserOrder = async (req, res, next) => {
  const { id } = req.params;
  const userOrders = await Order.find({ userId: id }).populate([
    { path: "userId", select: "_id username email role" },
  ]);
  if (!userOrders) return next(new AppError("orders not found", 404));

  res.status(200).json({ message: "success", userOrders });
};

module.exports = { getAllOrders, getOrderById, getUserOrder, addOrder };
