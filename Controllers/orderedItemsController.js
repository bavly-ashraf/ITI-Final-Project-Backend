require("dotenv").config();
const AppError = require("../Helpers/AppError");
const orderedItems = require("../Models/OrderedItems");

const User = require("../Models/Users");


const getOrderedItems = async (req, res, next) => {
  try {
    const userId = req.id;
    let orderItem = await orderedItems.find({ userId }).populate("productId");
    res.status(200).json({ message: "success", orderItem });
  } catch {
    return next(new AppError("Something went wrong"));
  }
};


const addOrderItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.id;
    let orderItem = await orderedItems.findOne({ productId, userId });
    if (orderItem) {
      orderItem.quantity += quantity;
    }
     else {
     orderItem = new orderedItems({ productId, quantity, userId });
    }
    await orderItem.save();
    await orderItem.populate("productId");
    res.status(200).json({ message: "success", orderItem });
  } catch {
    return next(new AppError("Something went wrong"));
  }
};


const deleteOrderItem = async (req, res, next) => {
  const foundedorderItem = await orderedItems.findById(req.params.id).populate("userId")
  console.log(foundedorderItem)
  if (!foundedorderItem) return next(new AppError('order item not found or deleted', 404))
  const { _id } = foundedorderItem.userId
  const user = await User.findById(req.id);
  if (_id.toString() !== req.id.toString() && user.role !== 'admin') return next(new AppError('unauthorized', 403))
  const deletedorderItem = await orderedItems.findByIdAndDelete(req.params.id)
  res.status(200).json({ message: 'success', deletedorderItem })
}




module.exports = { addOrderItem,deleteOrderItem,getOrderedItems};

