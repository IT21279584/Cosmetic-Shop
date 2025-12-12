import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../../../services/productService";
import adminService from "../../../services/adminService";
import { formatPrice } from "../../../utils/helpers";
import { FaEdit, FaTrash, FaPlus, FaBox, FaSearch } from "react-icons/fa";
import Button from "../../common/Button";
import Loader from "../../common/Loader";
import { toast } from "react-toastify";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setDeleteLoading(productToDelete._id);
    try {
      await adminService.deleteProduct(productToDelete._id);
      toast.success("Product deleted successfully!");
      setProducts(products.filter((p) => p._id !== productToDelete._id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader fullScreen />;

  return (
    <div className="w-full max-w-full">
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header Section - Fully Responsive */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
              Products
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Manage your product inventory
            </p>
          </div>
          <Link to="/admin/products/add">
            <button className="flex items-center justify-center w-full px-4 py-2.5 space-x-2 text-sm font-medium text-white transition-all rounded-lg sm:w-auto bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-sm hover:shadow-md sm:rounded-xl active:scale-95">
              <FaPlus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </Link>
        </div>

        {/* Search Bar - Responsive */}
        <div className="relative">
          <FaSearch className="absolute w-3 h-3 text-gray-400 transform -translate-y-1/2 sm:w-4 sm:h-4 left-3 sm:left-4 top-1/2" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-9 pr-3 text-sm sm:py-3 sm:pl-12 sm:pr-4 sm:text-base transition-all bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Products Table/Cards - Responsive */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
          {/* Desktop Table View */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-50">
                          <FaBox className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-base font-medium text-gray-900">
                            No products found
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {searchTerm
                              ? "Try adjusting your search"
                              : "Add your first product to get started"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              typeof product.images[0] === "string"
                                ? product.images[0]
                                : product.images[0]?.url
                            }
                            alt={product.name}
                            className="object-cover w-12 h-12 border border-gray-200 rounded-lg"
                            onError={(e) => {
                              e.target.src = "/placeholder-image.png";
                              e.target.onerror = null;
                            }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-primary-600">
                          {formatPrice(product.price)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                            product.stock <= 10
                              ? "bg-red-50 text-red-700"
                              : product.stock <= 50
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="p-2 transition-colors rounded-lg text-primary-600 hover:bg-primary-50"
                          >
                            <FaEdit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            disabled={deleteLoading === product._id}
                            className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-3 py-12 space-y-3 sm:px-4 sm:py-16">
                <div className="flex items-center justify-center w-12 h-12 rounded-full sm:w-16 sm:h-16 bg-gray-50">
                  <FaBox className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 sm:text-base">
                    No products found
                  </p>
                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    {searchTerm
                      ? "Try adjusting your search"
                      : "Add your first product to get started"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="p-3 transition-colors sm:p-4 hover:bg-gray-50"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {/* Product Image */}
                      <img
                        src={
                          typeof product.images[0] === "string"
                            ? product.images[0]
                            : product.images[0]?.url
                        }
                        alt={product.name}
                        className="flex-shrink-0 object-cover w-20 h-20 border border-gray-200 rounded-lg sm:w-24 sm:h-24"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.png";
                          e.target.onerror = null;
                        }}
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 sm:text-base line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between mt-2 sm:mt-3">
                          <div className="space-y-1">
                            <p className="text-base font-bold sm:text-lg text-primary-600">
                              {formatPrice(product.price)}
                            </p>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                                product.stock <= 10
                                  ? "bg-red-50 text-red-700"
                                  : product.stock <= 50
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-green-50 text-green-700"
                              }`}
                            >
                              {product.stock} in stock
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="p-2 text-blue-600 transition-colors rounded-lg sm:p-2.5 hover:bg-blue-50"
                            >
                              <FaEdit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              disabled={deleteLoading === product._id}
                              className="p-2 text-red-600 transition-colors rounded-lg sm:p-2.5 hover:bg-red-50 disabled:opacity-50"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Footer */}
        {filteredProducts.length > 0 && (
          <div className="flex flex-col gap-2 p-3 bg-white border border-gray-200 rounded-lg sm:flex-row sm:items-center sm:justify-between sm:p-4 sm:rounded-xl">
            <p className="text-xs text-gray-600 sm:text-sm">
              Showing{" "}
              <span className="font-semibold">{filteredProducts.length}</span>{" "}
              of <span className="font-semibold">{products.length}</span>{" "}
              products
            </p>
            <div className="flex gap-3 text-xs sm:gap-4 sm:text-sm">
              <span className="text-gray-600">
                Low Stock:{" "}
                <span className="font-semibold text-red-600">
                  {products.filter((p) => p.stock <= 10).length}
                </span>
              </span>
              <span className="text-gray-600">
                In Stock:{" "}
                <span className="font-semibold text-green-600">
                  {products.filter((p) => p.stock > 10).length}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-5 bg-white shadow-xl sm:p-6 rounded-xl">
            <h3 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl sm:mb-4">
              Confirm Delete
            </h3>
            <p className="mb-5 text-sm text-gray-600 sm:text-base sm:mb-6">
              Are you sure you want to delete "
              <span className="font-semibold">{productToDelete?.name}</span>"?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
              >
                {deleteLoading ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-2 text-white animate-spin"
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
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
