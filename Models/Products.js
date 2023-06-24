const mongoose=require('mongoose');
const { Schema } = mongoose;

//products schema 

const Products=mongoose.model('Products',ProductsSchema)
module.exports=Products;