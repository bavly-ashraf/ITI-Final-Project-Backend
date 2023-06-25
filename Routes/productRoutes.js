const express = require('express');
const routes = express.Router();
const {getProducts}=require('../Controllers/productsController');


//methods[get,post,patch,delete]

//////////get methods///////////

routes.get('/',getUsers);

routes.get('/:id',getUsersById);


module.exports = routes