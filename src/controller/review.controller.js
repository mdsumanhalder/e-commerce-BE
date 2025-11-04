const reviewService = require('../services/rating.service');

const createReview = async (req, res) => {
    const user = req.user;
    try {
        const review = await reviewService.createReview(req.body, user);
        return res.status(201).send(review);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const getAllReview = async (req, res) => {
    const { id } = req.params;
    try {
        const reviews = await reviewService.getAllReview(id);
        return res.status(201).send(reviews);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    createReview,
    getAllReview
};