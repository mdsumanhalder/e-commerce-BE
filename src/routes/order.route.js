const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');
const authenticate = require('../middleware/authenticate');
const authorizeRoles = require('../middleware/authorizeRole');

router.post("/", authenticate, orderController.createOrder);
router.post("/with-payment", authenticate, orderController.createOrderWithPayment);
router.get("/user", authenticate, orderController.orderHistory);
router.get("/seller", authenticate, authorizeRoles('SELLER', 'ADMIN'), orderController.sellerOrders);
router.put("/:id/cancel", authenticate, orderController.cancelOrder);
router.get("/:id", authenticate, orderController.findOrderById);

module.exports = router;
