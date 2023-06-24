const mongoose=require('mongoose');
const { Schema } = mongoose;

//OrderedItems schema 

const OrderedItems=mongoose.model('OrderedItems',OrderedItemsSchema)
module.exports=OrderedItems;
