const express = require('express');
const router = express.Router();
const adminOrderController = require('../controller/adminOrder.controller');
const authenticate = require('../middleware/authenticate');


router.get("/", authenticate, adminOrderController.getAllOrders);
router.put("/:orderId/confirmed", authenticate, adminOrderController.confirmedOrders);
router.put("/:orderId/ship", authenticate, adminOrderController.shippOrders);
router.put("/:orderId/deliver", authenticate, adminOrderController.deliverOrders);
router.put("/:orderId/cancel", authenticate, adminOrderController.cancelledOrders);
router.delete("/:orderId/delete", authenticate, adminOrderController.deleteOrders);

module.exports = router;