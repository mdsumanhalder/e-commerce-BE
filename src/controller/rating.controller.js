const ratingService = require('../services/rating.service');

const createRating = async (req, res) => {
    const user = req.user;
    try {
        const rating = await ratingService.createRating(req.body, user);
        return res.status(201).send(rating);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const getAllRatings = async (req, res) => {
    const { productId } = req.params;
    try {
        const ratings = await ratingService.getAllRatings(productId);
        return res.status(200).send(ratings);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

// const getProductRating = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const ratings = await ratingService.getProductRating(id);
//         return res.status(201).send(ratings);
//     } catch (error) {
//         res.status(500).send({ error: error.message });
//     }
// }

module.exports = {
    createRating,
    getAllRatings,
    // getProductRating
};
