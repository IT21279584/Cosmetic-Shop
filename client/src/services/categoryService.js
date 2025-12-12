import api from "./api";

const categoryService = {
  // Get all categories (flat list)
  getAllCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },

  // Get category tree (hierarchical structure)
  getCategoryTree: async (activeOnly = true) => {
    const response = await api.get("/categories/tree", {
      params: { activeOnly },
    });
    return response.data;
  },

  // Get main categories (level 0)
  getMainCategories: async () => {
    const response = await api.get("/categories/main");
    return response.data;
  },

  // Get subcategories of a parent
  getSubcategories: async (parentId) => {
    const response = await api.get(`/categories/${parentId}/subcategories`);
    return response.data;
  },

  // Get category breadcrumb/parent chain
  getCategoryBreadcrumb: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}/breadcrumb`);
    return response.data;
  },

  // Get single category
  getCategory: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  },

  // Create category (Admin)
  createCategory: async (data) => {
    const response = await api.post("/categories", data);
    return response.data;
  },

  // Update category (Admin)
  updateCategory: async (categoryId, data) => {
    const response = await api.put(`/categories/${categoryId}`, data);
    return response.data;
  },

  // Delete category (Admin)
  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  },

  // Deactivate category (Soft delete)
  deactivateCategory: async (categoryId) => {
    const response = await api.patch(`/categories/${categoryId}/deactivate`);
    return response.data;
  },

  // Activate category
  activateCategory: async (categoryId) => {
    const response = await api.patch(`/categories/${categoryId}/activate`);
    return response.data;
  },
};

export default categoryService;
