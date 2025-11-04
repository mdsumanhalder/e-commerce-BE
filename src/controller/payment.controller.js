const paymentService = require('../services/payment.service');
const orderService = require('../services/orderService');

const createPaymentIntent = async (req, res) => {
    try {
        const { orderId, amount, currency } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ 
                error: 'Valid amount is required' 
            });
        }

        // Verify order exists and belongs to user
        if (orderId) {
            const order = await orderService.findOrderById(orderId);
            if (!order || order.user._id.toString() !== req.user._id.toString()) {
                return res.status(404).json({ 
                    error: 'Order not found or access denied' 
                });
            }
        }

        const paymentIntent = await paymentService.createPaymentIntent(
            amount, 
            currency || 'usd', 
            orderId
        );

        return res.status(200).json({
            success: true,
            clientSecret: paymentIntent.clientSecret,
            paymentIntentId: paymentIntent.paymentIntentId,
        });

    } catch (error) {
        console.error('Payment intent creation error:', error);
        return res.status(500).json({ 
            error: error.message 
        });
    }
};

const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId, orderId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ 
                error: 'Payment Intent ID is required' 
            });
        }

        // Verify order exists and belongs to user
        if (orderId) {
            const order = await orderService.findOrderById(orderId);
            if (!order || order.user._id.toString() !== req.user._id.toString()) {
                return res.status(404).json({ 
                    error: 'Order not found or access denied' 
                });
            }
        }

        const result = await paymentService.confirmPayment(paymentIntentId, orderId);

        return res.status(200).json({
            success: result.success,
            paymentStatus: result.paymentStatus,
            message: result.message || 'Payment processed successfully',
            orderId: result.orderId,
        });

    } catch (error) {
        console.error('Payment confirmation error:', error);
        return res.status(500).json({ 
            error: error.message 
        });
    }
};

const createRefund = async (req, res) => {
    try {
        const { paymentIntentId, amount, reason } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ 
                error: 'Payment Intent ID is required' 
            });
        }

        const refund = await paymentService.createRefund(
            paymentIntentId, 
            amount, 
            reason
        );

        return res.status(200).json({
            success: true,
            refund: refund,
        });

    } catch (error) {
        console.error('Refund creation error:', error);
        return res.status(500).json({ 
            error: error.message 
        });
    }
};

const handleWebhook = async (req, res) => {
    try {
        const signature = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!endpointSecret) {
            console.error('Stripe webhook secret not configured');
            return res.status(400).json({ error: 'Webhook secret not configured' });
        }

        // Validate webhook signature
        const event = paymentService.validateWebhookSignature(
            req.body, 
            signature, 
            endpointSecret
        );

        // Handle the event
        await paymentService.handleWebhookEvent(event);

        return res.status(200).json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(400).json({ 
            error: `Webhook error: ${error.message}` 
        });
    }
};

module.exports = {
    createPaymentIntent,
    confirmPayment,
    createRefund,
    handleWebhook,
};