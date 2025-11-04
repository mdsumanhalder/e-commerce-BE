const cartService = require('./cart.service');
const paymentService = require('./payment.service');
const Address = require('../models/address.model');
const Order = require('../models/order.model');
const OrderItem = require('../models/orderItems.model');

async function createOrder(user, shipAddress){
   let address;

   if (shipAddress._id) {
      let existAddress = await Address.findById(shipAddress._id)
      address = existAddress
   } else {
      address = new Address(shipAddress)
      address.user = user;
      await address.save()
      user.address.push(address);
      await user.save();
   }
    const cart = await cartService.findUserCart(user._id);
    const orderItems=[];

    for (let item of cart.cartItems) {
        const orderItem = new OrderItem({
            price: item.price,
            product: item.product,
            quantity: item.quantity,
            size: item.size,
            userId: item.userId,
            discountedPrice: item.discountedPrice,
        })
        const createdOrderItem = await orderItem.save();
        orderItems.push(createdOrderItem);
    }

    const createdOrder = new Order({
        user,
        orderItems,
        totalPrice: cart.totalPrice,
        totalDiscountedPrice: cart.totalDiscountedPrice,
        discounte: cart.discounte,
        totalItem: cart.totalItem,
        shippAddress: address,
    });

    const savedOrder = await createdOrder.save();
    return savedOrder;
}

async function createOrderWithPayment(user, shipAddress, currency = 'usd'){
    // Create the order first
    const order = await createOrder(user, shipAddress);
    
    // Create payment intent for the order
    try {
        const paymentIntent = await paymentService.createPaymentIntent(
            order.totalDiscountedPrice,
            currency,
            order._id.toString()
        );

        return {
            order: order,
            paymentIntent: {
                clientSecret: paymentIntent.clientSecret,
                paymentIntentId: paymentIntent.paymentIntentId,
                amount: order.totalDiscountedPrice,
                currency: currency,
            }
        };
    } catch (error) {
        // If payment intent creation fails, we might want to delete the order
        // or mark it as payment-pending
        throw new Error(`Order created but payment setup failed: ${error.message}`);
    }
}


// For ADMIN this method
async function placeOrder(orderId){
    const order = await findOrderById(orderId);

    order.orderStatus = "PLACED";
    order.paymentDetails.status = "COMPLETED";

    return await order.save();
}

async function  confirmOrder(orderId){
    const order = await findOrderById(orderId);

    order.orderStatus = "CONFIRMED";
    
    return await order.save();
}

async function shipOrder(orderId){
    const order = await findOrderById(orderId);

    order.orderStatus = "SHIPPED";
    
    return await order.save();
}

async function deliverOrder(orderId){
    const order = await findOrderById(orderId);

    order.orderStatus = "DELIVERED";
    
    return await order.save();
}

async function cancelledOrder(orderId){
    const order = await findOrderById(orderId);

    order.orderStatus = "CANCELLED";
    
    return await order.save();
}

async function findOrderById(orderId){
    const order = await Order.findById(orderId)
    .populate({path: 'orderItems', populate: { path: 'product' }})
    .populate('user')
    .populate('shippingAddress');

     return order;
}
    
async function usersOrderHistory(userId){
    try {
        const orders = await Order.find({user: userId, orderStatus: "PLACED"})
        .populate({path: 'orderItems', populate: { path: 'product' }}).lean();

        return orders;

    } catch (error) {
        throw new Error(error.message);
    }
}

async function getAllOrders(){
    return await Order.find({user: userId, orderStatus: "PLACED"})
        .populate({path: 'orderItems', populate: { path: 'product' }}).lean();
}

async function deleteOrder(orderId){
    const order = await findOrderById(orderId);
    await Order.findByIdAndDelete(order._id);
}

module.exports = {
    createOrder,
    createOrderWithPayment,
    deliverOrder,
    cancelledOrder,
    findOrderById,
    usersOrderHistory,
    getAllOrders,
    deleteOrder,
    placeOrder,
    confirmOrder,
    shipOrder
}