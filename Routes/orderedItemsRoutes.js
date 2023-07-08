const express = require("express");
const router = express.Router();
const AppError = require("../Helpers/AppError");
const mongoose = require("mongoose");
const verifyToken = require("../Helpers/tokenAuth");



// //methods[get,post,patch,delete]

const {addOrderItem, deleteOrderItem ,getOrderedItems} = require("../Controllers/orderedItemsController");

router.get("/",verifyToken, getOrderedItems);

router.post("/",verifyToken,addOrderItem);

router.delete("/:id",verifyToken, deleteOrderItem);
// router.patch("/:id", updateOrderItemById);

module.exports = router;