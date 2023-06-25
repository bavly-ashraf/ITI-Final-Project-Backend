const mongoose = require("mongoose");
const { Schema } = mongoose;

//products schema

const ProductsSchema = new Schema({
    
  name: {
    type: String,
    required: [true, "please enter the product name"],
  },
  details: {
    description: {
      type: String,
      required: [true, "please enter the product description"],
    },
    details_images: [
      {
        type: String,
        required: [true, "please enter at least 1 photo for the product"],
      },
    ],
    dimensions: {
      height: {
        type: Number,
        required: [true, "please enter height of the product"],
      },
      width: {
        type: Number,
        required: [true, "please enter width of the product"],
      },
      depth: {
        type: Number,
        required: [true, "please enter depth of the product"],
      },
    },
  },
  category: {
    type: Schema.type.ObjectId,
    ref: "Categories",
    required: [true, "please enter a category"],
  },
  photo_url: [
    {
      type: String,
      required: [true, "please enter at least 1 photo for the product"],
    },
  ],
  vendor: {
    type: String,
    required: [true, "please enter a vendor name"],
  },
  productRating: {
    type: String,
  },
  no_of_reviews: {
    type: String,
  },
  no_of_items: {
    type: Number,
  },
  availability: {
    type: String,
    enum: ["available", "out of stock"],
  },
  Reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Products = mongoose.model("Products", ProductsSchema);
module.exports = Products;
