const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification.controller');
const authenticate = require('../middleware/authenticate');
const authorizeRoles = require('../middleware/authorizeRole');

router.use(authenticate, authorizeRoles('ADMIN'));

router.get('/', notificationController.listNotifications);

module.exports = router;
