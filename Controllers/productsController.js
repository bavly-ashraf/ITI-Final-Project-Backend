require("dotenv").config();
const AppError = require("../Helpers/AppError");
const Products = require("../Models/Products");
const Categories = require("../Models/Categories");
const cloudinary = require("../Helpers/cloudinary.js");

////////////////////////////////////get methods//////////////////////////////////

//http://localhost:8080/products

const getAllProducts = async (req, res, next) => {
  
    const { sort } = req.params;
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

    if (products.length === 0) return next(new AppError("No products were found!",404));

    res.status(200).send(products);
};

//http://localhost:8080/products/?product=
const getProductsBySearch = async(req,res,next)=>{
  const searchString = req.query.product;
  const searchedProducts = await Products.find({ name: { $regex: searchString,$options:"i" } })
  if (searchedProducts.length == 0) return next(new AppError('product not found',404));
  res.status(200).json(searchedProducts);
}

//http://localhost:8080/products/:id

const getProductById = async (req, res, next) => {
    const { id } = req.params;
    const product = await Products.findById(id);
    if (!product) return next(new AppError("Product not found", 404));
    res.status(200).json({ message: "Product retrieved successfully", product });
};

//http://localhost:8080/products/:category/

const getProductsByCategory = async (req, res, next) => {
    const category = await Categories.findById(req.params.category);
    if (!category) return next(new AppError("category does not exist",404));
    const products = await Products.find({category});
    if (products.length == 0) return next(new AppError("no products were found!",404));
    res.status(200).json({ message: "All products retrieved successfully", products });
};

//http://localhost:8080/products/filter/:sort

const getProductsByFilter = async (req, res, next) => {
    const {category,max,min} = req.body;
    let filter = { category };
    if (min && max) {
      filter.price = { $gte: min, $lte: max };
    } else if (min) {
      filter.price = { $gte: min };
    } else if (max) {
      filter.price = { $lte: max };
    }
    const { sort } = req.params;
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
    if (products.length == 0) return next(new AppError("no products were found!",404));
    res.status(200).json({ message: "All posts retrieved successfully", products });
};

////////////////////////////////////post methods//////////////////////////////////

//http://localhost:8080/products/:category
const createProduct = async (req, res, next) => {
    const {category} = req.params;
    console.log(req.files);
    const {photo_url,details_images} = req.files;
    if(photo_url.length == 0 || details_images.length == 0) return next(new AppError('please enter at least one image for product and one detailed image',404));
    const { name,description,height,width,depth,price,vendor,no_of_items_in_stock } = req.body;
    const mainImg = [];
    for(let i=0;i<photo_url.length;i++){
      mainImg.push((await cloudinary.uploader.upload(photo_url[i].path,{folder:'productImage'})).secure_url);
    }
    const imgs = [];
    for(let i=0;i<details_images.length;i++){
      imgs.push((await cloudinary.uploader.upload(details_images[i].path,{folder:'productDetailsImage'})).secure_url);
    }
    const product = new Products({ 
      name, 
      description,
      height,
      width,
      depth,
      details_images:imgs,
      price,
      category,
      photo_url:mainImg,
      vendor,
      no_of_items_in_stock,
    });
    await product.save();
    res.status(201).json({ message: "success" , product });
};

////////////////////////////////////delete methods//////////////////////////////////

//http://localhost:8080/products/:id

const deleteProduct = async(req,res,next)=>{
  const {id} = req.params;
  if(!id) return next(new AppError('please enter product id',404));
  const deletedProduct = await Products.findByIdAndDelete(id);
  //delete product review
  res.status(200).json({message:'success',deletedProduct});
}

////////////////////////////////////update methods//////////////////////////////////

//http://localhost:8080/products/:id

const updateProduct = async(req,res,next)=>{
    const {id} = req.params;
    const product = req.body;
    const updatedProduct = await Products.findByIdAndUpdate(id,product,{new:true});
    res.status(200).json({message:"success",updatedProduct});
}

////////////////////////////////////TopRated method//////////////////////////////////

//http://localhost:8080/products/:id

const topRatedProducts = async (req, res, next) => {
  // Aggregate pipeline to get the top 4 rated products
  const pipeline = [
      {
          $lookup: {
              from: 'reviews',
              localField: '_id',
              foreignField: 'productId',
              as: 'reviewArr'
          }
      },
      {
          $addFields: {
              averageRating: { $avg: '$reviewArr.rating' }
          }
      },
      {
          $sort: { averageRating: -1 }
      },
      {
          $limit: 4
      }
  ];

  const topProducts = await Products.aggregate(pipeline)
  if (!topProducts) return next(new AppError('Error retrieving top rated products', 404))
  res.status(200).json({ message: 'Top 4 rated products', topProducts })

}


module.exports = { getAllProducts, topRatedProducts ,getProductById,getProductsByCategory,getProductsByFilter,getProductsBySearch,createProduct,deleteProduct,updateProduct};


// const details =  {
//   description: "test",
//   details_images: [
//       "urlTest",
//   ],
//   dimensions: {
//     height: 30,
//     width: 40,
//     depth: 10,
//   },
// }