import api from "./api";

const cartService = {
  // Get user cart
  getCart: async () => {
    const response = await api.get("/cart");
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post("/cart", { productId, quantity });
    return response.data;
  },

  // Update cart item
  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete("/cart");
    return response.data;
  },

  // Get cart from local storage (for guests)
  getLocalCart: () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : { items: [], totalPrice: 0 };
  },

  // Save cart to local storage
  saveLocalCart: (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  },
};

export default cartService;
