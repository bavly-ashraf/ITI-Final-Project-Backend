const express = require('express');
const routes = express.Router();
const {getAllProducts,getProductById,getProductsByCategory,getProductsByFilter, getProductsBySearch, createProduct, deleteProduct, updateProduct}=require('../Controllers/productsController');
const fileUpload = require('../Helpers/fileUploader');


//////////get methods///////////

routes.get('/:sort',getAllProducts);

routes.get('/:id',getProductById);

routes.get('/:category',getProductsByCategory);

routes.get('/filter/:sort',getProductsByFilter);

//get products by search
routes.get('/',getProductsBySearch)

//create new product
routes.post('/:category',fileUpload(),createProduct)

//update existing product
routes.patch('/:id',updateProduct)

//delete product
routes.delete('/:id',deleteProduct)

module.exports = routes