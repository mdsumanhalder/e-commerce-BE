const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payment.controller');
const authenticate = require('../middleware/authenticate');

// Create payment intent
router.post('/create-payment-intent', authenticate, paymentController.createPaymentIntent);

// Confirm payment
router.post('/confirm-payment', authenticate, paymentController.confirmPayment);

// Create refund (admin only - you might want to add admin middleware)
router.post('/refund', authenticate, paymentController.createRefund);

// Stripe webhook endpoint (no authentication needed)
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
