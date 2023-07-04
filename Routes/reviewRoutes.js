const express = require('express');
const verifyToken = require('../Helpers/tokenAuth');
const { addReview , getUserReview , getProductReview , getAllReview , updateReview, deleteReview, getTopRatedReview} = require('../Controllers/reviewController');
const routes = express.Router();

//methods[get,post,patch,delete]
routes.get('/', verifyToken, getAllReview)
routes.get('/top/review' , getTopRatedReview)
routes.get('/:id', verifyToken, getProductReview)
routes.get('/user/:id', verifyToken, getUserReview)
routes.post('/:id', verifyToken, addReview)
routes.patch('/:id', verifyToken, updateReview)
routes.delete('/:id', verifyToken, deleteReview)


module.exports = routes