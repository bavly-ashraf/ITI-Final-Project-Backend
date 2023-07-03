const express = require('express');
const verifyToken = require('../Helpers/tokenAuth');
const { addReview , getUserReview} = require('../Controllers/reviewController');
const routes = express.Router();

//methods[get,post,patch,delete]
// router.get('/', verifyToken, getAllReview)
// router.get('/:id', verifyToken, getPostReview)
routes.get('/user/:id', verifyToken, getUserReview)
routes.post('/:id', verifyToken, addReview)
// router.patch('/:id', verifyToken, updateReview)
// router.delete('/:id', verifyToken, deletReview)


module.exports = routes