const express = require('express');
const routes = express.Router();
const {createCategory,getAllCategories,deleteCategoryById,updateCategoryById}=require('../Controllers/categoryController');
const verifyToken = require('../Helpers/tokenAuth');

//methods[get,post,patch,delete]

//////////get methods///////////

routes.get('/',getAllCategories);

//////////post methods///////////

routes.post('/',verifyToken,createCategory);

/////////////patch methods////////////////

routes.patch("/:id",verifyToken,updateCategoryById);

/////////////delete methods////////////////

routes.delete("/:id",verifyToken,deleteCategoryById);

module.exports = routes