import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import orderService from "../../../services/orderService";
import { formatPrice, formatDate } from "../../../utils/helpers";
import {
  FaShoppingBag,
  FaSearch,
  FaEye,
  FaFilter,
  FaReceipt,
} from "react-icons/fa";
import Loader from "../../common/Loader";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      processing: "bg-blue-50 text-blue-700 border-blue-200",
      shipped: "bg-purple-50 text-purple-700 border-purple-200",
      delivered: "bg-green-50 text-green-700 border-green-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      statusMap[status?.toLowerCase()] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="w-full max-w-full">
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header Section - Fully Responsive */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
              Orders
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Manage and track customer orders
            </p>
          </div>
          <div className="flex items-center px-3 py-2 space-x-2 border border-gray-200 rounded-lg sm:px-4 bg-gray-50 sm:rounded-xl">
            <FaShoppingBag className="w-3 h-3 text-gray-400 sm:w-4 sm:h-4" />
            <span className="text-xs font-medium text-gray-700 sm:text-sm">
              {orders.length} Total
            </span>
          </div>
        </div>

        {/* Filters Section - Responsive */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <FaSearch className="absolute w-3 h-3 text-gray-400 transform -translate-y-1/2 sm:w-4 sm:h-4 left-3 sm:left-4 top-1/2" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 pl-9 pr-3 text-sm sm:py-3 sm:pl-12 sm:pr-4 sm:text-base transition-all bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FaFilter className="absolute w-3 h-3 text-gray-400 transform -translate-y-1/2 pointer-events-none sm:w-4 sm:h-4 left-3 sm:left-4 top-1/2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2.5 pl-9 pr-8 text-sm sm:py-3 sm:pl-12 sm:pr-10 sm:text-base appearance-none bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:w-auto sm:min-w-[200px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table/Cards - Responsive */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
          {/* Desktop Table View */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase lg:px-6 lg:py-4">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase lg:px-6 lg:py-4">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase lg:px-6 lg:py-4">
                    Date
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase lg:px-6 lg:py-4">
                    Total
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase lg:px-6 lg:py-4">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase lg:px-6 lg:py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-12 text-center lg:px-6 lg:py-16"
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full sm:w-16 sm:h-16 bg-gray-50">
                          <FaShoppingBag className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 sm:text-base">
                            No orders found
                          </p>
                          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            {searchTerm || statusFilter !== "all"
                              ? "Try adjusting your filters"
                              : "No orders placed yet"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 lg:px-6 lg:py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-white rounded-lg lg:w-10 lg:h-10 bg-gradient-to-br from-primary-500 to-primary-600">
                            <FaReceipt className="w-3 h-3 lg:w-4 lg:h-4" />
                          </div>
                          <span className="text-xs font-medium text-gray-900 lg:text-sm">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 lg:px-6 lg:py-4">
                        <span className="text-xs text-gray-700 lg:text-sm">
                          {order.user?.name || "Guest"}
                        </span>
                      </td>
                      <td className="px-4 py-3 lg:px-6 lg:py-4">
                        <span className="text-xs text-gray-600 lg:text-sm">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3 lg:px-6 lg:py-4">
                        <span className="text-xs font-semibold lg:text-sm text-primary-600">
                          {formatPrice(order.totalPrice)}
                        </span>
                      </td>
                      <td className="px-4 py-3 lg:px-6 lg:py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded-full lg:px-3 lg:text-sm ${getStatusBadgeClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 lg:px-6 lg:py-4">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="inline-flex items-center space-x-1.5 text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          <FaEye className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="text-xs font-medium lg:text-sm">
                            View
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Enhanced Responsive */}
          <div className="md:hidden">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-3 py-12 space-y-3 sm:px-4 sm:py-16">
                <div className="flex items-center justify-center w-12 h-12 rounded-full sm:w-16 sm:h-16 bg-gray-50">
                  <FaShoppingBag className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 sm:text-base">
                    No orders found
                  </p>
                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "No orders placed yet"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="p-3 transition-colors sm:p-4 hover:bg-gray-50"
                  >
                    <div className="space-y-2.5 sm:space-y-3">
                      {/* Order Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2 sm:space-x-2.5">
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white rounded-lg sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600">
                            <FaReceipt className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                              #{order._id.slice(-8).toUpperCase()}
                            </h3>
                            <p className="text-xs text-gray-500 sm:text-sm">
                              {order.user?.name || "Guest"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-full sm:px-2.5 sm:py-1 ${getStatusBadgeClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>

                      {/* Order Details */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="text-base font-bold sm:text-lg text-primary-600">
                            {formatPrice(order.totalPrice)}
                          </p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-xs text-gray-500">Order Date</p>
                          <p className="text-xs font-medium text-gray-700 sm:text-sm">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* View Button */}
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="flex items-center justify-center w-full px-3 py-2 space-x-2 text-sm font-medium transition-colors border rounded-lg sm:py-2.5 text-primary-600 border-primary-200 bg-primary-50 hover:bg-primary-100"
                      >
                        <FaEye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Footer - Fully Responsive */}
        {filteredOrders.length > 0 && (
          <div className="space-y-3">
            {/* Summary Stats */}
            <div className="flex flex-col gap-2 p-3 bg-white border border-gray-200 rounded-lg sm:flex-row sm:items-center sm:justify-between sm:p-4 sm:rounded-xl">
              <p className="text-xs text-gray-600 sm:text-sm">
                Showing{" "}
                <span className="font-semibold">{filteredOrders.length}</span>{" "}
                of <span className="font-semibold">{orders.length}</span> orders
              </p>
              <div className="flex flex-wrap gap-3 text-xs sm:gap-4 sm:text-sm">
                <span className="text-gray-600">
                  Pending:{" "}
                  <span className="font-semibold text-yellow-600">
                    {orders.filter((o) => o.orderStatus === "pending").length}
                  </span>
                </span>
                <span className="text-gray-600">
                  Processing:{" "}
                  <span className="font-semibold text-blue-600">
                    {
                      orders.filter((o) => o.orderStatus === "processing")
                        .length
                    }
                  </span>
                </span>
                <span className="text-gray-600">
                  Delivered:{" "}
                  <span className="font-semibold text-green-600">
                    {orders.filter((o) => o.orderStatus === "delivered").length}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
