const express = require('express');
const router = express.Router();
const auditLogController = require('../controller/auditLog.controller');
const authenticate = require('../middleware/authenticate');
const authorizeRoles = require('../middleware/authorizeRole');

router.use(authenticate, authorizeRoles('ADMIN'));

router.get('/', auditLogController.listAuditLogs);

module.exports = router;
