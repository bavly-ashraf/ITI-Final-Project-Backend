const express = require("express");
const router = express.Router();
const AppError = require("../Helpers/AppError");
const mongoose = require("mongoose");
const verifyToken = require("../Helpers/tokenAuth");


// //methods[get,post,patch,delete]

const {addOrderItem, deleteOrderItem,updateOrderItemById } = require("../Controllers/orderedItemsController");

router.post("/",addOrderItem)
router.delete("/:id",verifyToken, deleteOrderItem);
router.patch("/:id", updateOrderItemById);

module.exports = router;