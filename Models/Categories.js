const mongoose=require('mongoose');
const { Schema } = mongoose;

//Categories schema 
const CategoriesSchema = new Schema({
    name: {
      type: String,
      required: [true, "please enter the product name"],
    },
    Products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
  });


const Categories=mongoose.model('Categories',CategoriesSchema)

module.exports=Categories;
