const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

const aggregateSales = async () => {
  const [totals] = await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        totalRevenue: { $sum: '$totalDiscountedPrice' },
        count: { $sum: 1 }
      }
    }
  ]);
  return totals || { totalRevenue: 0, count: 0 };
};

const getTopProducts = async (limit = 5) => {
  return await Product.find({ status: 'APPROVED', isDeleted: false })
    .sort({ numRatings: -1, quantity: -1 })
    .limit(limit)
    .select('title brand discountedPrice numRatings imageUrl')
    .lean();
};

const getOverview = async () => {
  const [totalUsers, totalProducts, pendingProducts, totalOrders, revenueAggregate] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments({ status: 'APPROVED', isDeleted: false }),
    Product.countDocuments({ status: { $in: ['PENDING', 'REJECTED'] }, isDeleted: false }),
    Order.countDocuments(),
    Order.aggregate([
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalDiscountedPrice' }
        }
      }
    ])
  ]);

  const revenue = revenueAggregate?.[0]?.revenue || 0;

  return {
    totalUsers,
    totalProducts,
    pendingProducts,
    totalOrders,
    totalRevenue: revenue,
    topProducts: await getTopProducts(),
  };
};

const getSalesTrend = async (days = 7) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        revenue: { $sum: '$totalDiscountedPrice' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  return data;
};

module.exports = {
  getOverview,
  getSalesTrend
};
