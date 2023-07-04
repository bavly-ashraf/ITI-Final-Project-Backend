const express = require("express");
const router = express.Router();
const { orderItems } = require("../Models/OrderedItems");
const AppError = require("../Helpers/AppError");
const Order = require("../Models/Order");
const mongoose = require("mongoose");
const verifyToken = require("../Helpers/tokenAuth");

//methods[get,post,patch,delete]

const { getAllOrders,getOrderById,getUserOrder,addOrder} = require('../Controllers/orderController');

router.get('/',verifyToken, getAllOrders)
router.get('/:id', getOrderById)
router.get('/user/:id', getUserOrder)

router.post('/', addOrder)
// router.patch('/:id', updateOrder)
// router.delete('/:id', deletOrder)




// router.get(`/`, async (req, res, next) => {
//   // const orderList = await Order.find().populate('fbUsers').sort({'dateOfOrder': -1});
//   const orderList = await Order.find().populate('User');

//   if (!orderList) return next(new AppError('orders are not found , 404'))
//   res.status(200).json({message: 'success',orderList});
// });

// router.post(`/`, async (req, res) => 
// {

//   const { Address, city, zip, country, phone, status, dateOfOrder, totalPrice ,userId } = req.body;

//   const newOrder = new Order({Address,city,zip,country,phone,status,dateOfOrder,totalPrice,userId });

//   await newOrder.save();
//   res.status(200).json({ message: 'success' });
// });

module.exports = router;
