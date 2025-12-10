const Rating = require('../models/rating.model');
const productService = require('./product.service');

async function  createRating(req, user){
    const product = await productService.findProductById(req.productId);
    const rating = new Rating({
        product: product._id,
        user : user._id,
        rating: req.rating,
        createdAt : new Date(),
    });

    return await rating.save();
}


async function getProductRating(productId){
 return await Rating.find({product:productId}).populate('user');
}

async function getAllRatings(productId){
    return getProductRating(productId);
}

module.exports = {
    createRating,
    getProductRating,
    getAllRatings
};
