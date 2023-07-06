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
  const foundedOrder = await Order.findById(req.params.id).populate([{ path: "userId", select: "_id username" },]);
  if (!foundedOrder) return next(new AppError("orders not found", 404));
  res.status(200).json({ message: "success", foundedOrder });
};

const addOrder = async (req, res, next) => {


    const { orderItems, Address, city, zip, country, phone, totalPrice } = req.body;
    
    // Check if user's role is "user"
    const user = await User.findById(req.id);
    if (!user || user.role !== 'user') {
        return next(new AppError('Only users can create orders.', 403));
    }
    
    const order = await Order.create({ orderItems, Address, city, zip, country, phone, totalPrice, userId:req.id });
    res.status(201).json({ message: 'success', order });
}

// Update an order's status by ID
// const updateOrderStatus = async (orderId, newStatus) => {
//   try {
//     const result = await Order.updateOne(
//       { _id: orderId },
//       { $set: { status: newStatus } }
//     );
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// };



const getUserOrder = async (req, res, next) => {
  const { id } = req.params;
  const userOrders = await Order.find({ userId: id }).populate([
    { path: "userId", select: "_id username email role" },
  ]);
  if (!userOrders) return next(new AppError("orders not found", 404));


    const { id } = req.params
    const userOrders = await Order.find({ userId: id }).populate([{ path: 'userId', select: '_id username email role' }])
    if(!userOrders) return next(new AppError ('orders not found',404 ) )

    res.status(200).json({ message: 'success', userOrders })
}

const updateOrder = async (req, res, next) => {
    const { orderItems, Address, city, zip, country, phone, totalPrice } = req.body;
    const foundedorder = await Order.findById(req.params.id)
    if (!foundedorder) return next(new AppError('order not found', 404))
    const user = await User.findById(req.id);

    if (foundedorder.userId.toString() !== req.id.toString() && user.role !== 'admin') return next(new AppError('unauthorized', 403))
    const updatedorder = await Order.findByIdAndUpdate(req.params.id, {  orderItems, Address, city, zip, country, phone, totalPrice }, { new: true })
    
    res.status(201).json({ message: 'success', updatedorder })
}

const deleteOrder = async (req, res, next) => {
    const foundedorder = await Order.findById(req.params.id).populate('userId')
    console.log(foundedorder)
    if (!foundedorder) return next(new AppError('order not found or deleted', 404))
    const { _id } = foundedorder.userId
    const user = await User.findById(req.id);
    if (_id.toString() !== req.id.toString() && user.role !== 'admin') return next(new AppError('unauthorized', 403))
    const deletedorder = await Order.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'success', deletedorder })
}

module.exports = {getAllOrders,getOrderById,getUserOrder,addOrder,updateOrder,deleteOrder,
    // updateOrderStatus

};
