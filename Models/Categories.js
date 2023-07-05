const mongoose=require('mongoose');
const { Schema } = mongoose;

//Categories schema 
const CategoriesSchema = new Schema({
    name: {
      type: String,
      required: [true, "please enter the product name"],
    },
  });


const Categories=mongoose.model('Categories',CategoriesSchema)

module.exports=Categories;
