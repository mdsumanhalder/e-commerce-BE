const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');
const authenticate = require('../middleware/authenticate');
const authorizeRoles = require('../middleware/authorizeRole');

router.get("/", productController.getAllProducts);
router.get("/id/:id", productController.findProductById);
router.post("/sample", authenticate, authorizeRoles('ADMIN'), productController.createSampleProducts);

module.exports = router;
