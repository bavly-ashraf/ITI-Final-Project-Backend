const express = require('express');
const routes = express.Router();
const {createCategory,getAllCategories,deleteCategoryById,updateCategoryById}=require('../Controllers/categoryController');

//methods[get,post,patch,delete]

//////////get methods///////////

routes.get('/',getAllCategories);

//////////post methods///////////

routes.post('/',createCategory);

/////////////patch methods////////////////

routes.patch("/:id", updateCategoryById);

/////////////delete methods////////////////

routes.delete("/:id",deleteCategoryById);



routes.use((err,req,res,next)=>{
	const statusCode = err.statusCode || 500;
	res.status(statusCode).send({
		status:statusCode,
		message: err?.message || 'internal server error',
		errors: err?.errors || []
	})
})

module.exports = routes