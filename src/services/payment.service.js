const stripe = require('../config/stripe');
const Order = require('../models/order.model');

class PaymentService {
    // Create a payment intent for Stripe
    async createPaymentIntent(amount, currency = 'usd', orderId = null) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Stripe expects amount in cents
                currency: currency,
                metadata: {
                    orderId: orderId || 'no-order',
                },
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status,
            };
        } catch (error) {
            throw new Error(`Payment intent creation failed: ${error.message}`);
        }
    }

    // Confirm payment and update order
    async confirmPayment(paymentIntentId, orderId) {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            
            if (paymentIntent.status === 'succeeded') {
                // Update order with payment details
                const order = await Order.findById(orderId);
                if (order) {
                    order.paymentDetails.paymentMethod = 'stripe';
                    order.paymentDetails.paymentId = paymentIntentId;
                    order.paymentDetails.transactionId = paymentIntent.charges.data[0]?.id || paymentIntentId;
                    order.paymentDetails.paymentStatus = 'COMPLETED';
                    order.orderStatus = 'PLACED';
                    
                    await order.save();
                }

                return {
                    success: true,
                    paymentStatus: paymentIntent.status,
                    orderId: orderId,
                };
            } else {
                return {
                    success: false,
                    paymentStatus: paymentIntent.status,
                    message: 'Payment not completed',
                };
            }
        } catch (error) {
            throw new Error(`Payment confirmation failed: ${error.message}`);
        }
    }

    // Create a refund
    async createRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
        try {
            const refund = await stripe.refunds.create({
                payment_intent: paymentIntentId,
                amount: amount ? Math.round(amount * 100) : undefined, // If no amount, refund full amount
                reason: reason,
            });

            return {
                refundId: refund.id,
                status: refund.status,
                amount: refund.amount / 100,
            };
        } catch (error) {
            throw new Error(`Refund creation failed: ${error.message}`);
        }
    }

    // Handle webhook events from Stripe
    async handleWebhookEvent(event) {
        try {
            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object;
                    const orderId = paymentIntent.metadata.orderId;
                    
                    if (orderId && orderId !== 'no-order') {
                        await this.confirmPayment(paymentIntent.id, orderId);
                    }
                    break;

                case 'payment_intent.payment_failed':
                    // Handle failed payment
                    console.log('Payment failed:', event.data.object.id);
                    break;

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            return { received: true };
        } catch (error) {
            throw new Error(`Webhook handling failed: ${error.message}`);
        }
    }

    // Validate webhook signature
    validateWebhookSignature(payload, signature, endpointSecret) {
        try {
            const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
            return event;
        } catch (error) {
            throw new Error(`Webhook signature validation failed: ${error.message}`);
        }
    }
}

module.exports = new PaymentService();