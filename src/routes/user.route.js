const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const authenticate = require('../middleware/authenticate');
const authorizeRoles = require('../middleware/authorizeRole');

router.get('/profile', authenticate, userController.getUserProfile);
router.put('/profile', authenticate, userController.updateProfile);

router.post('/address', authenticate, userController.addAddress);
router.put('/address/:id', authenticate, userController.updateAddress);
router.delete('/address/:id', authenticate, userController.deleteAddress);

router.get('/', authenticate, authorizeRoles('ADMIN'), userController.getAllUsers);
router.patch('/:id/role', authenticate, authorizeRoles('ADMIN'), userController.setUserRole);
router.patch('/:id/status', authenticate, authorizeRoles('ADMIN'), userController.toggleUserActive);

module.exports = router;
