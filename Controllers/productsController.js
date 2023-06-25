require("dotenv").config();
const AppError = require("../Helpers/AppError");
const Products = require("../Models/Products");


////////////////////////////////////get methods//////////////////////////////////

//http://localhost:8080/products

const getProducts = async (req, res, next) => {
    try {
      const products = await Products.find().select("-password");
      if (products.length == 0) return next(new AppError("Products not found"));
      res.send(products);
    } catch (error) {
      return next(error);
    }
  };
  

module.exports = {getProducts};