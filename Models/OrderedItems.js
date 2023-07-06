const mongoose = require("mongoose");
const { Schema } = mongoose;

//OrderedItems schema
const OrderedItemsSchema = new Schema({

  quantity: {
    type: Number,
    required: true,
    default:1
  },
  productId: {
    // type: Number,
    ref: "Users",
    // ref:'Products',
    type: mongoose.Schema.Types.ObjectId,
  },
});


const orderedItems = mongoose.model("orderedItems", OrderedItemsSchema);
module.exports = orderedItems;
