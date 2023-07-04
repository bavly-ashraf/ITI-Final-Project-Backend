const mongoose = require("mongoose");
const { Schema } = mongoose;

//OrderedItems schema
const OrderedItemsSchema = new Schema({
  quantity: {
    type: Number,
    required: true,
  },
  productId: {
    // type: Number,
    // ref: "User",
    ref:'Products',
    type: mongoose.Schema.Types.ObjectId,
  },
});
const OrderedItem = mongoose.model("orderItems", OrderedItemsSchema);
module.exports = OrderedItem;