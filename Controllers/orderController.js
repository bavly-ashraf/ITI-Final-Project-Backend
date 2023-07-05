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

  // Check if user's role is "user"
  const user = await User.findById(req.id);
  if (!user || user.role !== "user") {
    return next(new AppError("Only users can create orders.", 403));
  }

  const order = await Order.create({
    orderItems,
    Address,
    city,
    zip,
    country,
    phone,
    totalPrice,
    userId: req.id,
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

const deleteOrder = async (req, res, next) => {
  const { id } = req.params;
  const userFromToken = req.id;
  const user = await User.findById(userFromToken);
  const foundedOrder = await Order.findById(id);

  if (!foundedOrder) {
    return next(new AppError("Order not found", 404));
  }

  if (
    foundedOrder.userId.toString() !== userFromToken &&
    user.role !== "admin"
  ) {
    return next(
      new AppError("You are not authorized to delete this order", 403)
    );
  }

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    res.status(200).json({ message: "success", deletedOrder });
  } catch (error) {
    return next(new AppError("Error deleting order", 500));
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getUserOrder,
  addOrder,
  deleteOrder,
};
