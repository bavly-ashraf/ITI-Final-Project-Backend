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
  price: {
    type: Number,
    required: [true, "please enter the product price"],
  },
  category: {
    type: Schema.Types.ObjectId,
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
  no_of_items_in_stock: {
    type: Number,
  },
  availability: {
    type: String,
    enum: ["available", "out of stock"],
    default: "available",
  },
});

ProductsSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id', 
  foreignField: 'productId',    
  justOne: false,

})

// Enable virtual population
ProductsSchema.set('toObject', { virtuals: true });
ProductsSchema.set('toJSON', { virtuals: true, transform: (_doc, ret) => { delete ret.id; } });

const Products = mongoose.model("Products", ProductsSchema);
module.exports = Products;