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

module.exports = routes