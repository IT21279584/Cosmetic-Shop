import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import orderService from "../../../services/orderService";
import { formatPrice, formatDateTime } from "../../../utils/helpers";
import Loader from "../../common/Loader";
import Button from "../../common/Button";
import { toast } from "react-toastify";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrder(id);
      setOrder(data.data);
      setStatus(data.data.orderStatus);
    } catch (error) {
      toast.error("Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      await orderService.updateOrderStatus(id, status);
      toast.success("Order status updated successfully!");
      fetchOrder();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      processing: (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      shipped: (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
          />
        </svg>
      ),
      delivered: (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      cancelled: (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    };
    return icons[status] || icons.pending;
  };

  if (loading) return <Loader />;
  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-20 sm:h-20 bg-gradient-to-br from-primary-100 to-orange-100">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800 sm:text-xl">
            Order Not Found
          </h3>
          <p className="mb-4 text-sm text-gray-600 sm:text-base">
            The order you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/admin/orders")}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-3 bg-gradient-to-br from-primary-50 via-white to-orange-50 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header - Responsive */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 text-xs sm:text-sm font-medium transition-colors text-primary-600 hover:text-primary-700 group"
          >
            <svg
              className="w-3 h-3 transition-transform sm:w-4 sm:h-4 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Orders
          </button>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg shadow-lg sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-500 to-primary-600 sm:rounded-xl">
                <svg
                  className="w-4 h-4 text-white sm:w-5 sm:h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-transparent sm:text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text">
                  Order #{order._id.slice(-8).toUpperCase()}
                </h2>
                <p className="text-xs text-gray-600 sm:text-sm md:text-base">
                  Placed on {formatDateTime(order.createdAt)}
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border-2 font-semibold text-xs sm:text-sm md:text-base ${getStatusColor(
                order.orderStatus
              )}`}
            >
              {getStatusIcon(order.orderStatus)}
              <span className="capitalize">{order.orderStatus}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 lg:grid-cols-3">
          {/* Main Content - Left Side */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:col-span-2">
            {/* Order Items */}
            <div className="overflow-hidden border shadow-xl border-primary-100 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl">
              <div className="p-3 border-b sm:p-4 md:p-6 border-primary-100 bg-gradient-to-r from-primary-50/50 to-orange-50/50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-lg sm:w-8 sm:h-8 bg-gradient-to-br from-primary-400 to-primary-500">
                    <svg
                      className="w-3 h-3 text-white sm:w-4 sm:h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 sm:text-lg md:text-xl">
                    Order Items ({order.orderItems.length})
                  </h3>
                </div>
              </div>

              <div className="p-3 space-y-3 sm:p-4 md:p-6 sm:space-y-4">
                {order.orderItems.map((item, index) => (
                  <div
                    key={item._id}
                    className={`flex flex-col gap-3 p-3 transition-all duration-300 border sm:flex-row sm:items-center sm:p-4 border-primary-100 rounded-lg sm:rounded-xl hover:border-primary-300 hover:bg-primary-50/30 ${
                      index !== order.orderItems.length - 1
                        ? "mb-3 sm:mb-4"
                        : ""
                    }`}
                  >
                    <div className="flex items-start flex-1 gap-3 sm:gap-4">
                      <div className="relative flex-shrink-0 group">
                        <div className="overflow-hidden border-2 rounded-lg shadow-md border-primary-200 group-hover:border-primary-400">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-16 h-16 transition-transform sm:w-20 sm:h-20 md:w-24 md:h-24 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = "/placeholder-image.png";
                            }}
                          />
                        </div>
                        <div className="absolute px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-bold text-white rounded-md shadow-md -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-gradient-to-br from-primary-500 to-primary-600">
                          ×{item.quantity}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="mb-1 text-sm font-semibold text-gray-800 sm:text-base md:text-lg line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="mb-1.5 sm:mb-2 text-xs sm:text-sm text-gray-600">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                        {item.sku && (
                          <p className="inline-block px-2 py-0.5 sm:py-1 text-xs font-medium rounded-md bg-primary-100 text-primary-700">
                            SKU: {item.sku}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0 border-primary-100">
                      <span className="text-xs text-gray-600 sm:text-sm sm:mb-1">
                        Subtotal
                      </span>
                      <p className="text-lg font-bold text-transparent sm:text-xl bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="overflow-hidden border shadow-xl border-primary-100 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl">
              <div className="p-3 border-b sm:p-4 md:p-6 border-primary-100 bg-gradient-to-r from-primary-50/50 to-orange-50/50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-lg sm:w-8 sm:h-8 bg-gradient-to-br from-primary-400 to-primary-500">
                    <svg
                      className="w-3 h-3 text-white sm:w-4 sm:h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 sm:text-lg md:text-xl">
                    Shipping Address
                  </h3>
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-6">
                <div className="p-3 border-2 rounded-lg sm:p-4 sm:rounded-xl bg-gradient-to-br from-primary-50/30 to-orange-50/30 border-primary-200">
                  <p className="mb-1.5 sm:mb-2 text-sm font-semibold text-gray-800 sm:text-base md:text-lg">
                    {order.shippingAddress?.fullName}
                  </p>
                  <div className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm md:text-base text-gray-600">
                    <p>{order.shippingAddress?.address}</p>
                    <p>
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}{" "}
                      {order.shippingAddress?.postalCode}
                    </p>
                    <p>{order.shippingAddress?.country}</p>
                    {order.shippingAddress?.phone && (
                      <p className="flex items-center gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 font-medium border-t border-primary-200 text-primary-700">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {order.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Customer Information */}
            <div className="overflow-hidden border shadow-xl border-primary-100 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl">
              <div className="p-3 border-b sm:p-4 md:p-6 border-primary-100 bg-gradient-to-r from-primary-50/50 to-orange-50/50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-lg sm:w-8 sm:h-8 bg-gradient-to-br from-primary-400 to-primary-500">
                    <svg
                      className="w-3 h-3 text-white sm:w-4 sm:h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 sm:text-lg md:text-xl">
                    Customer
                  </h3>
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-6">
                <div className="p-3 border-2 rounded-lg sm:p-4 sm:rounded-xl bg-gradient-to-br from-primary-50/30 to-orange-50/30 border-primary-200">
                  <p className="mb-1.5 sm:mb-2 text-sm font-semibold text-gray-800 sm:text-base">
                    {order.user?.name}
                  </p>
                  <p className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 break-all">
                    <svg
                      className="flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4 text-primary-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {order.user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Status Update */}
            <div className="overflow-hidden border shadow-xl border-primary-100 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl">
              <div className="p-3 border-b sm:p-4 md:p-6 border-primary-100 bg-gradient-to-r from-primary-50/50 to-orange-50/50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-lg sm:w-8 sm:h-8 bg-gradient-to-br from-primary-400 to-primary-500">
                    <svg
                      className="w-3 h-3 text-white sm:w-4 sm:h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 sm:text-lg md:text-xl">
                    Update Status
                  </h3>
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-6">
                <label className="block mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium text-gray-700">
                  Order Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 mb-3 text-sm transition-all bg-white border rounded-lg sm:px-4 sm:py-3 sm:mb-4 sm:text-base border-primary-200 sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-300"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button
                  onClick={handleStatusUpdate}
                  loading={updating}
                  className="w-full"
                >
                  <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Update Status
                  </span>
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="overflow-hidden border shadow-xl border-primary-100 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl">
              <div className="p-3 border-b sm:p-4 md:p-6 border-primary-100 bg-gradient-to-r from-primary-50/50 to-orange-50/50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-lg sm:w-8 sm:h-8 bg-gradient-to-br from-primary-400 to-primary-500">
                    <svg
                      className="w-3 h-3 text-white sm:w-4 sm:h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 sm:text-lg md:text-xl">
                    Order Summary
                  </h3>
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-6">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm md:text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-800">
                      {formatPrice(order.itemsPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm md:text-base">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-800">
                      {formatPrice(order.shippingPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm md:text-base">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium text-gray-800">
                      {formatPrice(order.taxPrice)}
                    </span>
                  </div>
                  <div className="pt-2 mt-2 border-t-2 sm:pt-3 sm:mt-3 border-primary-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800 sm:text-base md:text-lg">
                        Total
                      </span>
                      <span className="text-xl font-bold text-transparent sm:text-2xl bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 mt-2 border-t sm:pt-3 sm:mt-3 border-primary-200">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium text-gray-800 capitalize">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5 sm:mt-2 text-xs sm:text-sm">
                      <span className="text-gray-600">Payment Status</span>
                      <span
                        className={`px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-md ${
                          order.isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.isPaid ? "✓ Paid" : "Pending"}
                      </span>
                    </div>
                    {order.isPaid && order.paidAt && (
                      <p className="mt-1.5 sm:mt-2 text-xs text-gray-500">
                        Paid on {formatDateTime(order.paidAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
