const express = require('express');
const router = express.Router();
const analyticsController = require('../controller/analytics.controller');
const authenticate = require('../middleware/authenticate');
const authorizeRoles = require('../middleware/authorizeRole');

router.use(authenticate, authorizeRoles('ADMIN'));

router.get('/overview', analyticsController.getOverview);
router.get('/sales-trend', analyticsController.getSalesTrend);

module.exports = router;
