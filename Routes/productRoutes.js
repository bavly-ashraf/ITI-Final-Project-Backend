const express = require('express');
const routes = express.Router();
const {getAllProducts,getProductById,getProductsByCategory,getProductsByFilter,createProduct,getAllProductsSorted}=require('../Controllers/productsController');


//////////get methods///////////

routes.get('/',getAllProducts);

routes.get('/sorted/:sort',getAllProductsSorted);

routes.get('/:id',getProductById);

routes.get('/category/:category',getProductsByCategory);

routes.get('/filter/:sort',getProductsByFilter);

routes.post('/',createProduct);


routes.use((err,req,res,next)=>{
	const statusCode = err.statusCode || 500;
	res.status(statusCode).send({
		status:statusCode,
		message: err?.message || 'internal server error',
		errors: err?.errors || []
	})
})

//get products by search
// routes.get('/',)

// //create new product
// routes.post('/',)

// //update existing product
// routes.put('/',)

// //delete product
// routes.delete('/',)

module.exports = routes