const mongoose=require('mongoose');
const { Schema } = mongoose;

//Reviews schema 

const Reviews=mongoose.model('Reviews',ReviewsSchema)
module.exports=Reviews;
