const express = require('express');
const verifyToken = require('../Helpers/tokenAuth');
const { addReview } = require('../Controllers/reviewController');
const routes = express.Router();

//methods[get,post,patch,delete]
// router.get('/', verifyToken, getAllReview)
// router.get('/:id', verifyToken, getPostReview)
// router.get('/user/:id', verifyToken, getUserReview)
router.post('/:id', verifyToken, addReview)
// router.patch('/:id', verifyToken, updateReview)
// router.delete('/:id', verifyToken, deletReview)


module.exports = routes