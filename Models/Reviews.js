const mongoose = require("mongoose");
const { Schema } = mongoose;

//Reviews schema

const ReviewsSchema = new Schema({
  reviewContent: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", ReviewsSchema);
module.exports = Review;
