const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');

// Public routes (no authentication required)
router.get("/", productController.getAllProducts);
router.get("/:id", productController.findProductById);

module.exports = router;