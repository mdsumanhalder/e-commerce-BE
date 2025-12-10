const orderService = require('../services/orderService');
const auditLogService = require('../services/auditLog.service');


const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        return res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const confirmOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await orderService.confirmOrder(orderId, req.user._id);
        await auditLogService.recordLog({
            actor: req.user._id,
            action: 'ORDER_CONFIRMED',
            targetType: 'ORDER',
            targetId: orderId,
            metadata: {},
            request: req
        });
        return res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const shipOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await orderService.shipOrder(orderId, req.user._id);
        await auditLogService.recordLog({
            actor: req.user._id,
            action: 'ORDER_SHIPPED',
            targetType: 'ORDER',
            targetId: orderId,
            metadata: {},
            request: req
        });
        return res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const deliverOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await orderService.deliverOrder(orderId, req.user._id);
        await auditLogService.recordLog({
            actor: req.user._id,
            action: 'ORDER_DELIVERED',
            targetType: 'ORDER',
            targetId: orderId,
            metadata: {},
            request: req
        });
        return res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const cancelOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await orderService.cancelledOrder(orderId, req.user._id);
        await auditLogService.recordLog({
            actor: req.user._id,
            action: 'ORDER_CANCELLED_ADMIN',
            targetType: 'ORDER',
            targetId: orderId,
            metadata: {},
            request: req
        });
        return res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const deleteOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        await orderService.deleteOrder(orderId);
        await auditLogService.recordLog({
            actor: req.user._id,
            action: 'ORDER_DELETED',
            targetType: 'ORDER',
            targetId: orderId,
            metadata: {},
            request: req
        });
        return res.status(204).send();
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    getAllOrders,
    confirmOrder,
    shipOrder,
    deliverOrder,
    cancelOrder,
    deleteOrder
};
