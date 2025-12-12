import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import categoryService from "../../../services/categoryService";
import adminService from "../../../services/adminService";
import {
  FaTrash,
  FaPlus,
  FaEdit,
  FaChevronRight,
  FaChevronDown,
  FaTags,
  FaList,
  FaSitemap,
} from "react-icons/fa";
import Button from "../../common/Button";
import Loader from "../../common/Loader";
import { toast } from "react-toastify";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [viewMode, setViewMode] = useState("tree");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const [flatData, treeData] = await Promise.all([
        categoryService.getAllCategories(),
        categoryService.getCategoryTree(false),
      ]);

      setCategories(flatData.data || flatData);
      setCategoryTree(treeData.data || treeData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    setDeleteLoading(categoryToDelete._id);
    try {
      await adminService.deleteCategory(categoryToDelete._id);
      toast.success("Category deleted successfully!");
      fetchCategories();
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleToggleActive = async (category) => {
    try {
      if (category.isActive) {
        await categoryService.deactivateCategory(category._id);
        toast.success("Category deactivated successfully!");
      } else {
        await categoryService.activateCategory(category._id);
        toast.success("Category activated successfully!");
      }
      fetchCategories();
    } catch (error) {
      console.error("Error toggling category status:", error);
      toast.error("Failed to update category status");
    }
  };

  const renderTreeCategory = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category._id);

    return (
      <React.Fragment key={category._id}>
        <tr
          className={`transition-colors hover:bg-gray-50 ${
            !category.isActive ? "opacity-60" : ""
          }`}
        >
          <td
            className="px-6 py-4"
            style={{ paddingLeft: `${24 + level * 32}px` }}
          >
            <div className="flex items-center gap-2">
              {hasChildren && (
                <button
                  onClick={() => toggleCategory(category._id)}
                  className="text-gray-400 transition-colors hover:text-primary-600"
                >
                  {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                </button>
              )}
              <span className="font-medium text-gray-900">{category.name}</span>
            </div>
          </td>
          <td className="px-6 py-4">
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 rounded-full bg-blue-50">
              Level {category.level || 0}
            </span>
          </td>
          <td className="px-6 py-4">
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
              {category.order || 0}
            </span>
          </td>
          <td className="px-6 py-4">
            <button
              onClick={() => handleToggleActive(category)}
              className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-all ${
                category.isActive
                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              {category.isActive ? "Active" : "Inactive"}
            </button>
          </td>
          <td className="px-6 py-4">
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleDeleteClick(category)}
                disabled={deleteLoading === category._id}
                className="flex items-center justify-center text-red-600 transition-all rounded-lg w-9 h-9 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                title="Delete category"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </td>
        </tr>
        {hasChildren && isExpanded && (
          <>
            {category.children.map((child) =>
              renderTreeCategory(child, level + 1)
            )}
          </>
        )}
      </React.Fragment>
    );
  };

  const renderMobileCard = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category._id);

    return (
      <React.Fragment key={category._id}>
        <div
          className={`p-4 transition-colors ${
            !category.isActive ? "opacity-60" : ""
          }`}
          style={{ paddingLeft: `${16 + level * 24}px` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start flex-1 min-w-0 gap-2">
              {hasChildren && (
                <button
                  onClick={() => toggleCategory(category._id)}
                  className="flex-shrink-0 mt-1 text-gray-400 transition-colors hover:text-primary-600"
                >
                  {isExpanded ? (
                    <FaChevronDown size={14} />
                  ) : (
                    <FaChevronRight size={14} />
                  )}
                </button>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 rounded-full bg-blue-50">
                    Level {category.level || 0}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                    Order: {category.order || 0}
                  </span>
                  <button
                    onClick={() => handleToggleActive(category)}
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      category.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDeleteClick(category)}
              disabled={deleteLoading === category._id}
              className="flex items-center justify-center flex-shrink-0 text-red-600 transition-all rounded-lg w-9 h-9 bg-red-50 hover:bg-red-100 disabled:opacity-50 active:scale-95"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <>
            {category.children.map((child) =>
              renderMobileCard(child, level + 1)
            )}
          </>
        )}
      </React.Fragment>
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
              Categories
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Organize products with categories
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setViewMode("tree")}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-all ${
                  viewMode === "tree"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaSitemap size={14} />
                <span className="hidden sm:inline">Tree</span>
              </button>
              <button
                onClick={() => setViewMode("flat")}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-all ${
                  viewMode === "flat"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaList size={14} />
                <span className="hidden sm:inline">Flat</span>
              </button>
            </div>
            <Link to="/admin/categories/add">
              <button className="flex items-center px-4 py-2 space-x-2 text-white transition-all shadow-md bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl hover:shadow-lg active:scale-95">
                <FaPlus size={14} />
                <span className="font-medium">Add Category</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Categories Table/Cards */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
          {/* Desktop Table View */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                    Level
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                    Order
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {viewMode === "tree" ? (
                  categoryTree.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-50">
                            <FaTags className="text-gray-400" size={24} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              No categories found
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Add your first category to get started
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    categoryTree.map((category) => renderTreeCategory(category))
                  )
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-50">
                          <FaTags className="text-gray-400" size={24} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            No categories found
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Add your first category to get started
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr
                      key={category._id}
                      className={`transition-colors hover:bg-gray-50 ${
                        !category.isActive ? "opacity-60" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div
                          className="flex items-center gap-2"
                          style={{
                            paddingLeft: `${(category.level || 0) * 16}px`,
                          }}
                        >
                          <span className="font-medium text-gray-900">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 rounded-full bg-blue-50">
                          Level {category.level || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                          {category.order || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(category)}
                          className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-all ${
                            category.isActive
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleDeleteClick(category)}
                            disabled={deleteLoading === category._id}
                            className="flex items-center justify-center text-red-600 transition-all rounded-lg w-9 h-9 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                            title="Delete category"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {viewMode === "tree" ? (
              categoryTree.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-16 space-y-3">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-50">
                    <FaTags className="text-gray-400" size={24} />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">
                      No categories found
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Add your first category to get started
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {categoryTree.map((category) => renderMobileCard(category))}
                </div>
              )
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-16 space-y-3">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-50">
                  <FaTags className="text-gray-400" size={24} />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">
                    No categories found
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Add your first category to get started
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {categories.map((category) =>
                  renderMobileCard(category, category.level || 0)
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Footer */}
        {(viewMode === "tree"
          ? categoryTree.length > 0
          : categories.length > 0) && (
          <div className="flex flex-col gap-2 p-4 bg-white border border-gray-200 sm:flex-row sm:items-center sm:justify-between rounded-xl">
            <p className="text-sm text-gray-600">
              Total <span className="font-semibold">{categories.length}</span>{" "}
              categories
            </p>
            <div className="flex gap-4 text-sm">
              <span className="text-gray-600">
                Active:{" "}
                <span className="font-semibold text-green-600">
                  {categories.filter((c) => c.isActive).length}
                </span>
              </span>
              <span className="text-gray-600">
                Inactive:{" "}
                <span className="font-semibold text-red-600">
                  {categories.filter((c) => !c.isActive).length}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md transition-all transform scale-100 bg-white shadow-2xl rounded-2xl">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                  <FaTrash className="text-red-600" size={20} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-center text-gray-900">
                  Delete Category
                </h3>
                <p className="mb-6 text-center text-gray-600">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">
                    "{categoryToDelete?.name}"
                  </span>
                  ? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteCancel}
                    disabled={deleteLoading}
                    className="flex-1 px-4 py-3 font-medium text-gray-700 transition-all bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleteLoading}
                    className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-white transition-all bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {deleteLoading ? (
                      <>
                        <svg
                          className="w-5 h-5 mr-2 -ml-1 text-white animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Delete Category"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
