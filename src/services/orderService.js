const cartService = require('./cart.service');
const paymentService = require('./payment.service');
const Address = require('../models/address.model');
const Order = require('../models/order.model');
const OrderItem = require('../models/orderItems.model');

const buildStatusHistoryEntry = (status, userId, note) => ({
  status,
  changedBy: userId,
  note
});

async function resolveShippingAddress(user, shipAddress) {
  if (!shipAddress) {
    throw new Error('Shipping address is required');
  }

  if (shipAddress._id) {
    const existAddress = await Address.findById(shipAddress._id);
    if (!existAddress) throw new Error('Shipping address not found');
    return existAddress;
  }

  const address = new Address(shipAddress);
  address.user = user._id;
  await address.save();
  user.address.push(address);
  await user.save();
  return address;
}

async function createOrder(user, shipAddress){
   const address = await resolveShippingAddress(user, shipAddress);
   const cart = await cartService.findUserCart(user._id);
   if (!cart || cart.cartItems.length === 0) {
    throw new Error('Cart is empty');
   }

    const orderItems=[];

    for (let item of cart.cartItems) {
        const orderItem = new OrderItem({
            price: item.product.price,
            product: item.product._id,
            quantity: item.quantity,
            size: item.size,
            userId: item.userId,
            discountedPrice: item.product.discountedPrice,
            seller: item.product.seller,
            productSnapshot: {
              title: item.product.title,
              imageUrl: item.product.imageUrl,
              brand: item.product.brand,
              color: item.product.color
            }
        });
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
        shippingAddress: address,
        statusHistory: [buildStatusHistoryEntry('PENDING', user._id, 'Order created')]
    });

    const savedOrder = await createdOrder.save();
    await cartService.clearCart(user._id);
    return savedOrder;
}

async function createOrderWithPayment(user, shipAddress, currency = 'usd'){
    const order = await createOrder(user, shipAddress);
    
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
        throw new Error(`Order created but payment setup failed: ${error.message}`);
    }
}

async function updateOrderStatus(orderId, status, actorId, note){
    const order = await findOrderById(orderId);
    order.orderStatus = status;
    order.statusHistory.push(buildStatusHistoryEntry(status, actorId, note));
    await order.save();
    return order;
}

async function placeOrder(orderId, actorId){
    return updateOrderStatus(orderId, 'PLACED', actorId, 'Order placed by admin');
}

async function confirmOrder(orderId, actorId){
    return updateOrderStatus(orderId, 'CONFIRMED', actorId, 'Order confirmed');
}

async function shipOrder(orderId, actorId){
    return updateOrderStatus(orderId, 'SHIPPED', actorId, 'Order shipped');
}

async function deliverOrder(orderId, actorId){
    return updateOrderStatus(orderId, 'DELIVERED', actorId, 'Order delivered');
}

async function cancelledOrder(orderId, actorId){
    return updateOrderStatus(orderId, 'CANCELLED', actorId, 'Order cancelled');
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
        const orders = await Order.find({user: userId})
        .populate({path: 'orderItems', populate: { path: 'product' }}).lean();

        return orders;

    } catch (error) {
        throw new Error(error.message);
    }
}

async function getAllOrders(filter = {}){
    return await Order.find(filter)
        .populate({path: 'orderItems', populate: { path: 'product' }})
        .populate('user')
        .populate('shippingAddress')
        .lean();
}

async function findOrdersBySeller(sellerId) {
  const sellerItems = await OrderItem.find({ seller: sellerId }).select('_id');
  if (!sellerItems.length) {
    return [];
  }
  const itemIds = sellerItems.map(item => item._id);
  return await Order.find({ orderItems: { $in: itemIds } })
    .populate({ path: 'orderItems', populate: { path: 'product' } })
    .populate('user')
    .populate('shippingAddress')
    .lean();
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
    shipOrder,
    findOrdersBySeller
};
