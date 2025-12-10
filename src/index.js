// Load environment variables first
require('dotenv').config();

// Validate environment variables
const { validateEnvironment } = require('./config/environment');
validateEnvironment();

const express = require('express');
const cors= require('cors');
const app = express();
const path = require('path');

// Configure CORS with environment variables
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send({ message:'Welcome to the e-commerceapp API', status: true, name:'Md Suman Halder' });
});
app.get('/htmlFile', (req, res) => {
  res.sendFile(path.join(__dirname, 'staticFile', 'index.html'))
});

const authRouters = require('./routes/auth.route');
const userRouters = require('./routes/user.route');
const productRouters = require('./routes/product.route');
const publicProductRouters = require('./routes/publicProduct.route');
const adminProductRouters = require('./routes/adminProduct.route');
const sellerProductRouters = require('./routes/sellerProduct.route');
const cartRouters = require('./routes/cart.route');
const cartItemRouters = require('./routes/cartItem.route');
const orderRouters = require('./routes/order.route');
const adminOrderRouters = require('./routes/adminOrder.route');
const reviewRouters = require('./routes/review.route');
const ratingRouters = require('./routes/rating.route');
const paymentRouters = require('./routes/payment.route');
const analyticsRouters = require('./routes/analytics.route');
const auditLogRouters = require('./routes/auditLog.route');
const notificationRouters = require('./routes/notification.route');
const categoryRouters = require('./routes/category.route');

app.use('/api/auth',authRouters);
app.use('/api/users', userRouters);
app.use('/api/products', productRouters);
app.use('/api/public/products', publicProductRouters);
app.use('/api/admin/products', adminProductRouters);
app.use('/api/seller/products', sellerProductRouters);
app.use('/api/cart', cartRouters);
app.use('/api/cart_items', cartItemRouters);
app.use('/api/orders', orderRouters);
app.use('/api/admin/orders', adminOrderRouters);
app.use('/api/reviews', reviewRouters);
app.use('/api/ratings', ratingRouters);
app.use('/api/payments', paymentRouters);
app.use('/api/admin/analytics', analyticsRouters);
app.use('/api/admin/audit-logs', auditLogRouters);
app.use('/api/admin/notifications', notificationRouters);
app.use('/api/categories', categoryRouters);


module.exports = app;
