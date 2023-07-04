require("dotenv").config();
const AppError = require("../Helpers/AppError");
const Review = require("../Models/Reviews");
const User = require("../Models/Users");

const getAllReview = async (req, res, next) => {
    const reviews = await Review.find().populate({
        path: 'productId',
        select: '_id name',
    }).populate({
        path: 'userId',
        select: '_id username email role',
    }).select('-__v')
    res.status(200).json({ message: 'success', reviews })
}

const getTopRatedReview =async(req, res, next)=>{
    const reviews = await Review.find({rating:5}).populate({
        path: 'productId',
        select: '_id name',
    }).populate({
        path: 'userId',
        select: '_id username city country',
    }).select('-__v')
    res.status(200).json({ message: 'success', reviews })
}

const getProductReview = async (req, res, next) => {
    const productReviews = await Review.find({ productId: req.params.id }).populate({
        path: 'productId',
        select: '_id name',
    }).populate({
        path: 'userId',
        select: '_id username email role',
    }).select('-__v')
    res.status(200).json({ message: 'success', productReviews })
}

 const getUserReview = async (req, res, next) => {
    const user = await User.findById(req.id);
     if (user.role !== "admin") return next(new AppError('unauthorized', 403))
     const userReviews = await Review.find({ userId: req.params.id }).populate({
         path: 'productId',
         select: '_id name',
     }).populate({
         path: 'userId',
         select: '_id username email role',
     }).select('-__v')
     res.status(200).json({ message: 'success', userReviews})
 }



const addReview = async (req, res, next) => {
    const { rating, reviewContent } = req.body
    const foundedReview = await Review.findOne({ userId: req.id, productId: req.params.id })
    if (foundedReview) return next(new AppError("only one review is allowed ", 400))
    const addedreview = await Review.create({ rating,reviewContent, userId: req.id, productId: req.params.id })
    res.status(201).json({ message: 'success', addedreview })
}

const updateReview = async (req, res, next) => {
    const { rating,reviewContent } = req.body
    const foundedreview = await Review.findById(req.params.id)
    if (!foundedreview) return next(new AppError('review not found', 404))
    if (foundedreview.userId.toString() !== req.id.toString()) return next(new AppError('unauthorized', 403))
    const updatedreview = await Review.findByIdAndUpdate(req.params.id, { rating,reviewContent }, { new: true })
    res.status(201).json({ message: 'success', updatedreview })
}

const deleteReview = async (req, res, next) => {
    const foundedreview = await Review.findById(req.params.id).populate('userId').populate('productId')
    if (!foundedreview) return next(new AppError('comment not found or already deleted', 404))
    const { _id } = foundedreview.userId
    const user = await User.findById(req.id);
    if (_id.toString() !== req.id.toString() && user.role !== 'admin') return next(new AppError('unauthorized', 403))
    const deletedreview = await Review.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'success', deletedreview })
}

// module.exports = { getUserReview, getAllReview, addReview, getPostReview, updateReview, deletReview };
module.exports = { getUserReview,getTopRatedReview, addReview , getProductReview , getAllReview , updateReview, deleteReview};