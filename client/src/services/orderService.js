import api from "./api";

const orderService = {
  // Create order
  createOrder: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  // Get user orders
  getMyOrders: async (page = 1, limit = 10) => {
    const response = await api.get("/orders/my-orders", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get single order
  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get all orders (Admin)
  getAllOrders: async (params = {}) => {
    const response = await api.get("/orders", { params });
    return response.data;
  },

  // Update order status (Admin)
  updateOrderStatus: async (orderId, status, trackingNumber) => {
    const response = await api.put(`/orders/${orderId}/status`, {
      orderStatus: status,
      trackingNumber,
    });
    return response.data;
  },
};

export default orderService;
