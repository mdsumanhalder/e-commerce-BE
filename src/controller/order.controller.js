const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
    const user = await req.user;
    try {
        const createdOrder = await orderService.createOrder(user, req.body);
        return res.status(201).send(createdOrder);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const createOrderWithPayment = async (req, res) => {
    const user = await req.user;
    try {
        const { currency } = req.body;
        const orderWithPayment = await orderService.createOrderWithPayment(
            user, 
            req.body, 
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
    const user = await req.user;
    try {
        const orders = await orderService.findOrderById(req.params.id);
        return res.status(201).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const orderHistory = async (req, res) => {
    const user = await req.user;
    try {
        const orders = await orderService.usersOrderHistory(user._id);
        return res.status(201).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    createOrder,
    createOrderWithPayment,
    orderHistory,
    findOrderById
};