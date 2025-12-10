const express = require('express');
const router = express.Router();
const adminOrderController = require('../controller/adminOrder.controller');
const authenticate = require('../middleware/authenticate');
const authorizeRoles = require('../middleware/authorizeRole');

router.use(authenticate, authorizeRoles('ADMIN'));

router.get("/", adminOrderController.getAllOrders);
router.put("/:orderId/confirmed", adminOrderController.confirmOrder);
router.put("/:orderId/ship", adminOrderController.shipOrder);
router.put("/:orderId/deliver", adminOrderController.deliverOrder);
router.put("/:orderId/cancel", adminOrderController.cancelOrder);
router.delete("/:orderId/delete", adminOrderController.deleteOrder);

module.exports = router;
