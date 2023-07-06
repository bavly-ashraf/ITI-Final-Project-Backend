const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderedItemsSchema = new Schema({

  quantity: {
    type: Number,
    required: true,
    default:1
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});


const orderedItems = mongoose.model("orderedItems", OrderedItemsSchema);
module.exports = orderedItems;
