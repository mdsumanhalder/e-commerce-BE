const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const authenticate = require('../middleware/authenticate');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);


module.exports = router;
