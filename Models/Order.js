const mongoose=require('mongoose');
const { Schema } = mongoose;

//Order schema 

const Order=mongoose.model('Order',OrderSchema)
module.exports=Order;
