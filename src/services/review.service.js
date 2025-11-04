const Review = require('../models/review.model');
const productService = require('./product.service');

async function createReview(regData, user) {
    const product = await productService.findProductById(regData.productId);
    const review = new Review({
        user : user._id,
        product: product._id,
        review: regData.review,
        createdAt : new Date(),
    });
    await product.save();
    return await review.save();
}

async function getAllReview(productId){
    const product = await productService.findProductById(regData.productId);
    
    return await Review.find({product: productId}).populate('user');
}

module.exports = {
    createReview,
    getAllReview
};