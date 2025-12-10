const orderService = require('../services/orderService');
const notificationService = require('../services/notification.service');
const auditLogService = require('../services/auditLog.service');
const User = require('../models/user.model');

const createOrder = async (req, res) => {
    const user = req.user;
    try {
        const createdOrder = await orderService.createOrder(user, req.body.shippingAddress || req.body);
        const hydratedOrder = await orderService.findOrderById(createdOrder._id);

        await notificationService.queueNotification({
            recipients: [user._id],
            emails: [user.email],
            subject: `Order ${hydratedOrder._id} placed successfully`,
            body: `<p>Your order totaling $${hydratedOrder.totalDiscountedPrice} is now pending.</p>`,
            meta: { orderId: hydratedOrder._id }
        });

        const sellerIds = [
            ...new Set(
                hydratedOrder.orderItems
                    .map(item => item.seller || item.product?.seller)
                    .filter(Boolean)
                    .map(id => id.toString())
            )
        ];

        if (sellerIds.length) {
            const sellers = await User.find({ _id: { $in: sellerIds } }).select('email firstName');
            for (const seller of sellers) {
                await notificationService.queueNotification({
                    recipients: [seller._id],
                    emails: [seller.email],
                    subject: `New order ${hydratedOrder._id} includes your product`,
                    body: `<p>You sold an item in order #${hydratedOrder._id}. Total order value: $${hydratedOrder.totalDiscountedPrice}.</p>`,
                    meta: { orderId: hydratedOrder._id }
                });
            }
        }

        await auditLogService.recordLog({
            actor: user._id,
            action: 'ORDER_CREATED',
            targetType: 'ORDER',
            targetId: hydratedOrder._id.toString(),
            metadata: { total: hydratedOrder.totalDiscountedPrice },
            request: req
        });

        return res.status(201).send(hydratedOrder);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const createOrderWithPayment = async (req, res) => {
    const user = req.user;
    try {
        const { currency, shippingAddress } = req.body;
        const orderWithPayment = await orderService.createOrderWithPayment(
            user, 
            shippingAddress || req.body, 
            currency
        );
        
        return res.status(201).json({
            success: true,
            order: orderWithPayment.order,
            paymentIntent: orderWithPayment.paymentIntent,
            message: 'Order created successfully. Complete payment to place the order.',
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const findOrderById = async (req, res) => {
    try {
        const order = await orderService.findOrderById(req.params.id);
        return res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const orderHistory = async (req, res) => {
    const user = req.user;
    try {
        const orders = await orderService.usersOrderHistory(user._id);
        return res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const sellerOrders = async (req, res) => {
    const user = req.user;
    try {
        const orders = await orderService.findOrdersBySeller(user._id);
        return res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const cancelOrder = async (req, res) => {
    const user = req.user;
    try {
        const order = await orderService.findOrderById(req.params.id);
        if (!order) {
            return res.status(404).send({ error: 'Order not found' });
        }
        if (user.role !== 'ADMIN' && order.user._id.toString() !== user._id.toString()) {
            return res.status(403).send({ error: 'You cannot cancel this order' });
        }
        const cancelled = await orderService.cancelledOrder(req.params.id, user._id);
        return res.status(200).send(cancelled);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    createOrder,
    createOrderWithPayment,
    orderHistory,
    findOrderById,
    sellerOrders,
    cancelOrder
};
