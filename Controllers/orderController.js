require("dotenv").config();
const AppError = require("../Helpers/AppError");
const Order = require("../Models/Order");
const User = require("../Models/Users");
const OrderedItems = require("../Models/OrderedItems");


const getAllOrders= async (req, res, next) => {
    const user = await User.findById(req.id);
    console.log(user)
    if(user.role!=="admin") return next(new AppError ('unauthorized',403 ) )
    const orders = await Order.find().populate([{ path: 'userId', select: '_id username role' }]).sort({'dateOfOrder': -1});
    res.status(200).json({ message: 'success', orders })

}
const getPendingOrders = async (req, res, next) => {
  const user = await User.findById(req.id);
  console.log(user);
  if (user.role !== "admin") return next(new AppError("unauthorized", 403));
  const orders = await Order.find({ status: "pending" }) // Filter by status: "pending"
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
    const { orderItems, address, city, zip, country, phone, totalPrice } = req.body;
    
    // Check if user's role is "user"
    const user = await User.findById(req.id);
    if (!user || user.role !== 'user') {
        return next(new AppError('Only users can create orders.', 403));
    }
    
    const order = await Order.create({ orderItems, Address:address, city, zip, country, phone, totalPrice, userId:req.id });
    orderItems.forEach(async(item)=> await OrderedItems.findByIdAndDelete(item));
    res.status(201).json({ message: 'success', order });
}


const getUserOrder = async (req, res, next) => {

    const { id } = req.params
    const userOrders = await Order.find({ userId: id }).populate([{ path: 'userId', select: '_id username email role' }])
    if(!userOrders) return next(new AppError ('orders not found',404 ) )

    res.status(200).json({ message: 'success', userOrders })
}


const updateOrderStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    
    // Check if user is admin
    const user = await User.findById(req.id);
    if (!user || user.role !== 'admin') {
      return next(new AppError('You are not authorized to perform this action', 401));
    }
  
    const order = await Order.findById(id);
  
    if (!order) {
      return next(new AppError('Order not found', 404));
    }
  
    if (status !== 'pending' && status !== 'confirmed') {
      return next(new AppError('Invalid status', 400));
    }
  
    order.status = status;
    await order.save();
  
    res.status(200).json({ message: 'success', order });
  };
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

module.exports = {getAllOrders,getOrderById,getUserOrder,addOrder,updateOrderStatus,updateOrder,deleteOrder,getPendingOrders};

