import api from "./api";

const productService = {
  // Get all products with filters
  getAllProducts: async (params = {}) => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  // Get single product
  getProduct: async (slugOrId) => {
    const response = await api.get(`/products/${slugOrId}`);
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (productId) => {
    const response = await api.get(`/products/${productId}/related`);
    return response.data;
  },

  // Get best sellers
  getBestSellers: async (limit = 8) => {
    const response = await api.get("/products/best-sellers", {
      params: { limit },
    });
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await api.get("/products", {
      params: { featured: true, limit: 8 },
    });
    return response.data;
  },

  // Search products
  searchProducts: async (searchTerm) => {
    const response = await api.get("/products", {
      params: { search: searchTerm },
    });
    return response.data;
  },

  // Get product reviews
  getProductReviews: async (productId, page = 1, limit = 10) => {
    const response = await api.get(`/reviews/products/${productId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Create product review
  createReview: async (productId, reviewData) => {
    const response = await api.post(
      `/reviews/products/${productId}`,
      reviewData
    );
    return response.data;
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};

export default productService;
