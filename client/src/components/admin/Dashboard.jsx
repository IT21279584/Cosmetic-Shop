import React, { useState, useEffect } from "react";
import {
  FaShoppingBag,
  FaDollarSign,
  FaUsers,
  FaBox,
  FaArrowUp,
  FaArrowDown,
  FaShoppingCart,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaTimesCircle,
  FaChartLine,
  FaSpinner,
  FaChartBar,
  FaEye,
  FaStar,
  FaFire,
  FaBolt,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { Link } from "react-router-dom";
import orderService from "../../services/orderService";
import productService from "../../services/productService";
import { formatPrice, formatDate } from "../../utils/helpers";
import Loader from "../common/Loader";

const Dashboard = ({ stats }) => {
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
  });
  const [dashboardData, setDashboardData] = useState({
    revenueData: [],
    categoryData: [],
    orderStatusData: [],
    topProducts: [],
    recentOrders: [],
    weeklyComparison: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  // Animated counter effect
  useEffect(() => {
    if (stats) {
      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setAnimatedStats({
          revenue: Math.floor((stats.totalRevenue || 0) * progress),
          orders: Math.floor((stats.totalOrders || 0) * progress),
          products: Math.floor((stats.totalProducts || 0) * progress),
          customers: Math.floor((stats.totalUsers || 0) * progress),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedStats({
            revenue: stats.totalRevenue || 0,
            orders: stats.totalOrders || 0,
            products: stats.totalProducts || 0,
            customers: stats.totalUsers || 0,
          });
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [stats]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [orders, products] = await Promise.all([
        orderService.getAllOrders(),
        productService.getAllProducts(),
      ]);

      const ordersData = orders.data || [];
      const productsData = products.data || [];

      const revenueByMonth = processRevenueByMonth(ordersData);
      const categoryStats = processCategoryData(productsData);
      const orderStatus = processOrderStatus(ordersData);
      const topProductsList = processTopProducts(ordersData, productsData);
      const weeklyData = processWeeklyComparison(ordersData);
      const recentOrdersList = ordersData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);

      setDashboardData({
        revenueData: revenueByMonth,
        categoryData: categoryStats,
        orderStatusData: orderStatus,
        topProducts: topProductsList,
        recentOrders: recentOrdersList,
        weeklyComparison: weeklyData,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processRevenueByMonth = (orders) => {
    const monthlyData = {};
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthKey = months[date.getMonth()];

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, revenue: 0, orders: 0 };
      }

      monthlyData[monthKey].revenue += order.totalPrice || 0;
      monthlyData[monthKey].orders += 1;
    });

    return Object.values(monthlyData);
  };

  const processCategoryData = (products) => {
    const categoryMap = {};

    products.forEach((product) => {
      const categoryName = product.category?.name || "Uncategorized";

      if (!categoryMap[categoryName]) {
        categoryMap[categoryName] = {
          name: categoryName,
          value: 0,
          fill: getRandomColor(),
        };
      }

      categoryMap[categoryName].value += product.price * product.stock;
    });

    return Object.values(categoryMap)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  const processOrderStatus = (orders) => {
    const statusMap = {
      pending: { name: "Pending", value: 0, fill: "#FCD34D" },
      processing: { name: "Processing", value: 0, fill: "#60A5FA" },
      shipped: { name: "Shipped", value: 0, fill: "#A78BFA" },
      delivered: { name: "Delivered", value: 0, fill: "#34D399" },
      cancelled: { name: "Cancelled", value: 0, fill: "#F87171" },
    };

    orders.forEach((order) => {
      const status = order.orderStatus?.toLowerCase();
      if (statusMap[status]) {
        statusMap[status].value += 1;
      }
    });

    return Object.values(statusMap).filter((s) => s.value > 0);
  };

  const processTopProducts = (orders, products) => {
    const productSales = {};

    orders.forEach((order) => {
      order.orderItems?.forEach((item) => {
        const productId = item.product?._id || item.product;

        if (!productSales[productId]) {
          productSales[productId] = {
            name: item.name || "Unknown Product",
            sales: 0,
            revenue: 0,
          };
        }

        productSales[productId].sales += item.quantity || 0;
        productSales[productId].revenue +=
          (item.price || 0) * (item.quantity || 0);
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const processWeeklyComparison = (orders) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekData = days.map((day) => ({ day, thisWeek: 0, lastWeek: 0 }));

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const dayIndex = (date.getDay() + 6) % 7;
      const daysAgo = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));

      if (daysAgo < 7) {
        weekData[dayIndex].thisWeek += order.totalPrice || 0;
      } else if (daysAgo < 14) {
        weekData[dayIndex].lastWeek += order.totalPrice || 0;
      }
    });

    return weekData;
  };

  const getRandomColor = () => {
    const colors = [
      "#3B82F6",
      "#8B5CF6",
      "#EC4899",
      "#10B981",
      "#F59E0B",
      "#EF4444",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      shipped: "bg-purple-100 text-purple-700 border-purple-200",
      delivered: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      colors[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: FaClock,
      processing: FaShoppingCart,
      shipped: FaTruck,
      delivered: FaCheckCircle,
      cancelled: FaTimesCircle,
    };
    const Icon = icons[status?.toLowerCase()] || FaClock;
    return <Icon className="w-3 h-3" />;
  };

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    gradient,
    suffix = "",
    trend,
  }) => (
    <div className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm group rounded-2xl hover:shadow-xl hover:-translate-y-1">
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
      ></div>

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
          >
            <Icon className="text-white w-7 h-7" />
          </div>
          {change !== undefined && (
            <div
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                change >= 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {change >= 0 ? (
                <FaArrowUp className="w-3 h-3" />
              ) : (
                <FaArrowDown className="w-3 h-3" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>

        <h3 className="mb-1 text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">
          {suffix === "$" && "$"}
          {typeof value === "number" ? value.toLocaleString() : value}
          {suffix !== "$" && suffix}
        </p>

        {trend && <p className="mt-2 text-xs text-gray-500">{trend}</p>}
      </div>
    </div>
  );

  const MiniStatCard = ({ icon: Icon, label, value, color }) => (
    <div
      className={`flex items-center p-4 space-x-3 bg-gradient-to-br ${color} rounded-xl text-white shadow-lg`}
    >
      <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-white rounded-lg bg-opacity-20 backdrop-blur">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-medium opacity-90">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-3 py-4 space-y-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 sm:px-4 sm:py-6 md:px-6 lg:px-8 lg:py-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center space-x-3 text-2xl font-bold text-gray-900 md:text-3xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
              Analytics Dashboard
            </span>
            <FaBolt className="text-yellow-500 animate-pulse" />
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time insights into your business performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <StatCard
          title="Total Revenue"
          value={animatedStats.revenue.toFixed(2)}
          suffix="$"
          change={12.5}
          icon={FaDollarSign}
          gradient="from-green-500 to-emerald-600"
          trend="↑ 12.5% from last month"
        />
        <StatCard
          title="Total Orders"
          value={animatedStats.orders}
          change={8.3}
          icon={FaShoppingBag}
          gradient="from-blue-500 to-cyan-600"
          trend="↑ 8.3% from last month"
        />
        <StatCard
          title="Total Products"
          value={animatedStats.products}
          change={-2.1}
          icon={FaBox}
          gradient="from-purple-500 to-pink-600"
          trend="↓ 2.1% from last month"
        />
        <StatCard
          title="Total Customers"
          value={animatedStats.customers}
          change={15.8}
          icon={FaUsers}
          gradient="from-orange-500 to-red-600"
          trend="↑ 15.8% from last month"
        />
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <MiniStatCard
          icon={FaChartBar}
          label="Conversion Rate"
          value="3.2%"
          color="from-blue-500 to-blue-600"
        />
        <MiniStatCard
          icon={FaEye}
          label="Page Views"
          value="12.4K"
          color="from-purple-500 to-purple-600"
        />
        <MiniStatCard
          icon={FaStar}
          label="Avg. Rating"
          value="4.8"
          color="from-yellow-500 to-orange-600"
        />
        <MiniStatCard
          icon={FaFire}
          label="Hot Products"
          value={dashboardData.topProducts.length}
          color="from-red-500 to-pink-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Trend */}
        <div className="p-6 bg-white border border-gray-100 shadow-lg lg:col-span-2 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
              <p className="text-sm text-gray-500">Monthly revenue overview</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
              <FaChartLine className="text-white" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardData.revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Order Status</h3>
            <p className="text-sm text-gray-500">Current distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {dashboardData.orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {dashboardData.orderStatusData.map((status, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: status.fill }}
                ></div>
                <span className="text-xs text-gray-600">
                  {status.name}: {status.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weekly Comparison */}
        <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Weekly Comparison
            </h3>
            <p className="text-sm text-gray-500">This week vs last week</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.weeklyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Bar
                dataKey="thisWeek"
                fill="#3B82F6"
                radius={[8, 8, 0, 0]}
                name="This Week"
              />
              <Bar
                dataKey="lastWeek"
                fill="#E5E7EB"
                radius={[8, 8, 0, 0]}
                name="Last Week"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
              <p className="text-sm text-gray-500">Best performing items</p>
            </div>
            <FaFire className="text-2xl text-orange-500" />
          </div>
          <div className="space-y-3">
            {dashboardData.topProducts.slice(0, 5).map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 transition-all duration-200 border border-gray-100 rounded-xl hover:shadow-md hover:border-primary-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-lg bg-gradient-to-br from-primary-500 to-purple-600">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.sales} units sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">
                    {formatPrice(product.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <p className="text-sm text-gray-500">
              Latest customer transactions
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All →
          </Link>
        </div>

        {/* Desktop View */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                  Order
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                  Customer
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dashboardData.recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white rounded-full bg-gradient-to-br from-primary-500 to-purple-600">
                        {order.user?.name?.charAt(0) || "G"}
                      </div>
                      <span className="text-sm text-gray-700">
                        {order.user?.name || "Guest"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-bold text-green-600">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium border rounded-full ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="space-y-3 md:hidden">
          {dashboardData.recentOrders.map((order) => (
            <div
              key={order._id}
              className="p-4 border border-gray-100 rounded-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900">
                  #{order._id.slice(-8).toUpperCase()}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium border rounded-full ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {getStatusIcon(order.orderStatus)}
                  {order.orderStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {order.user?.name || "Guest"}
                </span>
                <span className="text-sm font-bold text-green-600">
                  {formatPrice(order.totalPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
