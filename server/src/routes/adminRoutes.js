const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// Get dashboard statistics
router.get("/stats", protect, adminOnly, async (req, res, next) => {
  try {
    // Get total orders
    const totalOrders = await Order.countDocuments();

    // Get total revenue
    const revenueData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get total users
    const totalUsers = await User.countDocuments({ role: "user" });

    // Get pending orders
    const pendingOrders = await Order.countDocuments({
      orderStatus: "pending",
    });

    // Get low stock products
    const lowStockProducts = await Product.countDocuments({
      stock: { $lte: 10 },
    });

    // Recent orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalUsers,
        pendingOrders,
        lowStockProducts,
        recentOrders,
        monthlyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get all users (Admin)
router.get("/users", protect, adminOnly, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
