import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaEye,
  FaCalendarAlt,
  FaBox,
  FaArrowRight,
} from "react-icons/fa";
import orderService from "../../services/orderService";
import { formatPrice, formatDate } from "../../utils/helpers";
import { ORDER_STATUS_COLORS } from "../../utils/constants";
import Loader from "../common/Loader";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "from-yellow-500 to-orange-500",
      processing: "from-blue-500 to-indigo-500",
      shipped: "from-purple-500 to-pink-500",
      delivered: "from-green-500 to-emerald-500",
    };
    return colors[status?.toLowerCase()] || "from-gray-500 to-gray-600";
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
          <FaShoppingBag className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">
            Order History
          </h2>
          <p className="text-sm text-gray-600">{orders.length} total orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center bg-gradient-to-br from-gray-50 to-white rounded-2xl">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 rounded-full opacity-50 bg-primary-100 blur-2xl animate-pulse"></div>
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full shadow-xl bg-gradient-to-br from-primary-500 to-primary-600">
              <FaShoppingBag className="text-4xl text-white" />
            </div>
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            No Orders Yet
          </h3>
          <p className="mb-6 text-gray-600">
            You haven't placed any orders yet
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 font-bold text-white transition-all shadow-lg bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:shadow-xl hover:scale-105"
          >
            <FaShoppingBag />
            Start Shopping
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-4 transition-all bg-white border-2 border-gray-100 rounded-2xl lg:p-6 hover:shadow-xl hover:border-primary-200 group"
            >
              <div className="flex flex-col justify-between gap-4 mb-4 lg:flex-row lg:items-center">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                    <FaBox className="text-lg text-gray-600" />
                  </div>
                  <div>
                    <p className="mb-1 font-mono text-sm font-semibold text-gray-600">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FaCalendarAlt />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getStatusColor(
                    order.orderStatus
                  )} text-white font-bold text-sm rounded-xl shadow-md`}
                >
                  <span className="capitalize">{order.orderStatus}</span>
                </span>
              </div>

              {/* Order Items Preview */}
              <div className="pb-4 mb-4 space-y-3 border-b-2 border-gray-100">
                {order.orderItems.slice(0, 2).map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="flex-shrink-0 overflow-hidden bg-gray-100 rounded-lg shadow-sm w-14 h-14">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                {order.orderItems.length > 2 && (
                  <p className="text-sm font-medium text-gray-600 pl-17">
                    +{order.orderItems.length - 2} more items
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="mb-1 text-xs text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(order.totalPrice)}
                  </p>
                </div>
                <Link
                  to={`/profile/orders/${order._id}`}
                  className="flex items-center justify-center w-full gap-2 px-6 py-3 font-bold text-white transition-all shadow-md sm:w-auto bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:shadow-lg group-hover:scale-105"
                >
                  <FaEye />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
