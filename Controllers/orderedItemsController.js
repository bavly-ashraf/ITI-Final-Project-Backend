require("dotenv").config();
const AppError = require("../Helpers/AppError");
const OrderedItems = require("../Models/OrderedItems");
const User = require("../Models/Users");


const addOrderItem = async (req, res, next) => {

  try {
    const { productId, quantity } = req.body;
    const userId = req.id;
    let orderItem = await OrderedItems.findOne({ productId, userId });
    if (orderItem) {
      orderItem.quantity += quantity;
    }
     else {
     orderItem = new OrderedItems({ productId, quantity, userId });
    }

    await orderItem.save();
    res.status(200).json({ message: "success", orderItem });
  } catch {
    return next(new AppError("Something went wrong"));
  }

};

const updateOrderItemById = async (req, res, next) => {
    // const user = await User.findById(req.id);
    // if(user.role != "admin") return next(new AppError("unauthorized",403));
    // const orderItem = await Categories.findById(req.params.id);
    // if (!orderItem) return next(new AppError("this orderItem is not found"));
    // const newOrderItem = await Categories.findByIdAndUpdate(
    //   req.params.id,
    //   req.body,
    //   {
    //     new: true,
    //   }
    // );
    // res.send({ message: "orderItem updated successfully", newOrderItem });
};


const deleteOrderItem = async (req, res, next) => {
    const userFromToken = req.id;
    const user = await User.findById(userFromToken)
    const orderItem = await OrderedItems.findById(req.params.id);
    if (orderItem.userId.toString() !== user._id.toString() && user.role !== "admin") return next(new AppError("unauthorized",403));
    if (!orderItem) return next(new AppError("order item does not exist"));
    await OrderedItems.findByIdAndDelete(req.params.id);
    res.send({ message: "order item deleted successfully" });
};


module.exports = { addOrderItem,deleteOrderItem,updateOrderItemById};

