const express = require('express');
const routes = express.Router();
const {getAllProducts,getProductById,getProductsByCategory,getProductsByFilter}=require('../Controllers/productsController');


//////////get methods///////////

routes.get('/:sort',getAllProducts);

routes.get('/:id',getProductById);

routes.get('/:category',getProductsByCategory);

routes.get('/filter/:sort',getProductsByFilter);


routes.use((err,req,res,next)=>{
	const statusCode = err.statusCode || 500;
	res.status(statusCode).send({
		status:statusCode,
		message: err?.message || 'internal server error',
		errors: err?.errors || []
	})
})

module.exports = routes