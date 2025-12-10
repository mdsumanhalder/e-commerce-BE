const Review = require('../models/review.model');
const productService = require('./product.service');

async function createReview(reqData, user) {
    const product = await productService.findProductById(reqData.productId);
    if (!product) {
        throw new Error('Product not found');
    }
    const review = new Review({
        user : user._id,
        product: product._id,
        review: reqData.review,
        createdAt : new Date(),
    });
    return await review.save();
}

async function getAllReview(productId){
    await productService.findProductById(productId);
    return await Review.find({product: productId}).populate('user');
}

module.exports = {
    createReview,
    getAllReview
};
