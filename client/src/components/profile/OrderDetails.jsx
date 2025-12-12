import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaBox,
  FaReceipt,
} from "react-icons/fa";
import orderService from "../../services/orderService";
import { formatPrice, formatDateTime } from "../../utils/helpers";
import { ORDER_STATUS_COLORS } from "../../utils/constants";
import Loader from "../common/Loader";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await orderService.getOrder(orderId);

        if (response.data) {
          setOrder(response.data);
        } else if (response.order) {
          setOrder(response.order);
        } else {
          setOrder(response);
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusIcon = (status) => {
    const icons = {
      pending: FaClock,
      processing: FaBox,
      shipped: FaTruck,
      delivered: FaCheckCircle,
    };
    const Icon = icons[status?.toLowerCase()] || FaClock;
    return <Icon />;
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
      <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <Loader />
          <p className="mt-4 font-medium text-gray-600">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-white lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="p-6 border-2 border-red-200 shadow-lg bg-gradient-to-br from-red-50 to-red-100 rounded-2xl lg:p-8">
            <div className="mb-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-red-900">
                Error Loading Order
              </h3>
              <p className="text-red-700">{error}</p>
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 font-semibold text-red-600 transition-all bg-white rounded-xl hover:shadow-lg"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/profile/orders")}
                className="px-6 py-3 font-semibold text-white transition-all bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:shadow-lg"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-white lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="p-6 text-center border-2 border-yellow-200 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl lg:p-8">
            <div className="mb-4 text-6xl">📦</div>
            <h3 className="mb-2 text-xl font-bold text-yellow-900">
              Order Not Found
            </h3>
            <p className="mb-6 text-yellow-700">Order ID: {orderId}</p>
            <button
              onClick={() => navigate("/profile/orders")}
              className="px-6 py-3 font-semibold text-white transition-all bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl hover:shadow-lg"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 via-white to-gray-50 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/profile/orders")}
            className="flex items-center gap-2 mb-4 font-semibold transition-colors text-primary-600 hover:text-primary-700 group"
          >
            <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Back to Orders
          </button>

          <div className="p-6 bg-white shadow-xl rounded-2xl lg:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900 lg:text-3xl">
                  Order Details
                </h1>
                <p className="font-mono text-sm text-gray-600">
                  #{order._id?.slice(-8).toUpperCase() || orderId}
                </p>
              </div>

              {order.orderStatus && (
                <div
                  className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${getStatusColor(
                    order.orderStatus
                  )} text-white font-bold rounded-xl shadow-lg`}
                >
                  {getStatusIcon(order.orderStatus)}
                  <span className="capitalize">{order.orderStatus}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="p-6 transition-shadow bg-white shadow-lg rounded-2xl hover:shadow-xl">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <FaMapMarkerAlt className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Shipping Address
                  </h3>
                  <p className="text-xs text-gray-500">Delivery destination</p>
                </div>
              </div>
              <div className="space-y-1 text-gray-700 pl-13">
                <p className="font-semibold">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-sm">{order.shippingAddress.addressLine1}</p>
                <p className="text-sm">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
              </div>
            </div>
          )}

          {/* Order Info */}
          <div className="p-6 transition-shadow bg-white shadow-lg rounded-2xl hover:shadow-xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <FaReceipt className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Order Information
                </h3>
                <p className="text-xs text-gray-500">
                  Payment and status details
                </p>
              </div>
            </div>
            <div className="space-y-3 pl-13">
              {order.createdAt && (
                <div className="flex items-center gap-2 text-sm">
                  <FaCalendarAlt className="text-gray-400" />
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-900">
                    {formatDateTime(order.createdAt)}
                  </span>
                </div>
              )}
              {order.paymentMethod && (
                <div className="flex items-center gap-2 text-sm">
                  <FaCreditCard className="text-gray-400" />
                  <span className="text-gray-600">Payment:</span>
                  <span className="font-semibold text-gray-900 uppercase">
                    {order.paymentMethod}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <FaCheckCircle
                  className={
                    order.isPaid ? "text-green-500" : "text-yellow-500"
                  }
                />
                <span className="text-gray-600">Status:</span>
                <span
                  className={`font-semibold ${
                    order.isPaid ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        {order.orderItems && order.orderItems.length > 0 && (
          <div className="p-6 bg-white shadow-xl rounded-2xl lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <FaBox className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order Items</h3>
                <p className="text-xs text-gray-500">
                  {order.orderItems.length} items in this order
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div
                  key={item._id || index}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 ${
                    index !== order.orderItems.length - 1
                      ? "border-b-2 border-gray-100"
                      : ""
                  }`}
                >
                  {item.image && (
                    <div className="flex-shrink-0 w-20 h-20 overflow-hidden bg-gray-100 shadow-md rounded-xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="mb-1 font-semibold text-gray-900">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="px-2 py-1 font-medium text-gray-700 bg-gray-100 rounded-lg">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-gray-600">
                        {formatPrice(item.price)} each
                      </span>
                    </div>
                  </div>
                  <div className="text-right sm:text-left">
                    <p className="mb-1 text-xs text-gray-500">Subtotal</p>
                    <p className="text-lg font-bold text-primary-600">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="pt-6 mt-8 border-t-2 border-gray-200">
              <div className="p-6 space-y-3 bg-gradient-to-br from-gray-50 to-white rounded-xl">
                {order.itemsPrice !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(order.itemsPrice)}
                    </span>
                  </div>
                )}
                {order.shippingPrice !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(order.shippingPrice)}
                    </span>
                  </div>
                )}
                {order.taxPrice !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(order.taxPrice)}
                    </span>
                  </div>
                )}
                {order.totalPrice !== undefined && (
                  <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                    <span className="text-xl font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
