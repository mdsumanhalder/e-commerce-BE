const express = require('express');
const router = express.Router();
const Category = require('../models/category.model');

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.level) {
      filter.level = Number(req.query.level);
    }
    const categories = await Category.find(filter).sort({ name: 1 });
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
