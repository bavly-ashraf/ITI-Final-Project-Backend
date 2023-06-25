require("dotenv").config();
const AppError = require("../Helpers/AppError");
const Products = require("../Models/Products");
const Categories = require("../Models/Categories");

////////////////////////////////////get methods//////////////////////////////////

//http://localhost:8080/products

const getAllProducts = async (req, res, next) => {
  try {
    const { sort } = req.params.sort;
    let products;
    switch (sort) {
      case 'lowest':
        products = await Products.find().sort({ price: 1 });
        break;
      case 'highest':
        products = await Products.find().sort({ price: -1 });
        break;
      default:
        products = await Products.find();
        break;
    }

    if (products.length === 0) {
      return next(new AppError("No products were found!"));
    }

    res.send(products);
  } catch (error) {
    return next(error);
  }
};


//http://localhost:8080/products/:id

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Products.findById(id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    res.send({ message: "Product retrieved successfully", product });
  } catch (err) 
  {
    return next(err);
  }
};

//http://localhost:8080/products/:category/

const getProductsByCategory = async (req, res, next) => {
  try
  {
    const category = await Categories.findById(req.params.category);
    if (!category) return next(new AppError("category does not exist"));
    const products = await Products.find({category});
    if (products.length == 0) return next(new AppError("no products were found!"));
    res.send({ message: "All posts retrieved successfully", products });
  }
  catch (err) 
  {
    return next(err);
  }
};

//http://localhost:8080/products/filter/:sort

const getProductsByFilter = async (req, res, next) => {
  try
  {
    const {category,max,min} = req.body;
    let filter = { category };
    if (min && max) {
      filter.price = { $gte: min, $lte: max };
    } else if (min) {
      filter.price = { $gte: min };
    } else if (max) {
      filter.price = { $lte: max };
    }
    const { sort } = req.params.sort;
    let products;
    switch (sort) {
      case 'lowest':
        products = await Products.find(filter).sort({ price: 1 });
        break;
      case 'highest':
        products = await Products.find(filter).sort({ price: -1 });
        break;
      default:
        products = await Products.find(filter);
        break;
    }
    if (products.length == 0) return next(new AppError("no products were found!"));
    res.send({ message: "All posts retrieved successfully", products });
  }
  catch (err) 
  {
    return next(err);
  }
};



module.exports = { getAllProducts ,getProductById,getProductsByCategory,getProductsByFilter};
