const express = require('express');
const router = express.Router();
const sellerProductController = require('../controller/sellerProduct.controller');
const authenticate = require('../middleware/authenticate');
const authorizeRoles = require('../middleware/authorizeRole');

router.use(authenticate, authorizeRoles('SELLER', 'ADMIN'));

router.get('/', sellerProductController.listSellerProducts);
router.post('/', sellerProductController.createSellerProduct);
router.put('/:id', sellerProductController.updateSellerProduct);
router.delete('/:id', sellerProductController.deleteSellerProduct);

module.exports = router;
