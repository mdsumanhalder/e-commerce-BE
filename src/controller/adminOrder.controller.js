const orderService = require('../services/orderService');


const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        return res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const confirmedOrders = async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await orderService.confirmOrder(id);
        return res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const shippOrders = async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await orderService.shipOrder(id);
        return res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const deliverOrders = async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await orderService.deliverOrder(id);
        return res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const cancelledOrders = async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await orderService.cancelledOrder(id);
        return res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const deleteOrders = async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await orderService.deleteOrder(id);
        return res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    getAllOrders,
    confirmedOrders,
    shippOrders,
    deliverOrders,
    cancelledOrders,
    deleteOrders
};