const express = require('express');
const router = express.Router();
const adminProductController = require('../controller/adminProduct.controller');
const authenticate = require('../middleware/authenticate');
const authorizeRoles = require('../middleware/authorizeRole');

router.use(authenticate, authorizeRoles('ADMIN'));

router.get("/", adminProductController.listProducts);
router.post("/", adminProductController.createProduct);
router.post("/creates", adminProductController.createMultipleProducts);
router.put("/:id", adminProductController.updateProduct);
router.delete("/:id", adminProductController.deleteProduct);
router.post("/:id/approve", adminProductController.approveProduct);
router.post("/:id/reject", adminProductController.rejectProduct);
router.post("/:id/restore", adminProductController.restoreProduct);

module.exports = router;
