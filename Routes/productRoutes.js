const express = require('express');
const routes = express.Router();
const {getAllProducts,getProductById,getProductsByCategory,getProductsByFilter, getProductsBySearch, createProduct, deleteProduct, updateProduct, topRatedProducts,addProductToFav,removeProductfromFav}=require('../Controllers/productsController');
const fileUpload = require('../Helpers/fileUploader');
const verifyToken = require('../Helpers/tokenAuth');


//////////get methods///////////

routes.get('/:sort',getAllProducts);

routes.get('/product/:id',getProductById);

routes.get('/top/rated',topRatedProducts);

routes.get('/:category',getProductsByCategory);

routes.get('/filter/:sort',getProductsByFilter);

//get products by search

routes.get('/',getProductsBySearch)

//create new product

routes.post('/:category',fileUpload(),verifyToken,createProduct)

//update existing product

routes.patch('/fav/:id',verifyToken,addProductToFav)

routes.patch('/unfav/:id',verifyToken,removeProductfromFav)

routes.patch('/:id',verifyToken,updateProduct)

//delete product
routes.delete('/:id',verifyToken,deleteProduct)

module.exports = routes