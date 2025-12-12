import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FaChevronRight,
  FaHome,
  FaTimes,
  FaFilter,
  FaThLarge,
  FaBars,
} from "react-icons/fa";
import ProductGrid from "../components/products/ProductGrid";
import Pagination from "../components/common/Pagination";
import categoryService from "../services/categoryService";
import productService from "../services/productService";
import PriceFilter from "../components/filters/PriceFilter";
import CategoryFilter from "../components/filters/CategoryFilter";
import SortFilter from "../components/filters/SortFilter";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });
  const [selectedRange, setSelectedRange] = useState({ min: "", max: "" });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [categoryBreadcrumbs, setCategoryBreadcrumbs] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize from URL on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const sortFromUrl = searchParams.get("sort");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    if (sortFromUrl) {
      setSelectedSort(sortFromUrl);
    }
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [searchParams, selectedRange, selectedCategory, selectedSort]);

  // Update breadcrumbs when category changes
  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const breadcrumbs = buildCategoryBreadcrumbs(selectedCategory);
      setCategoryBreadcrumbs(breadcrumbs);
    } else {
      setCategoryBreadcrumbs([]);
    }
  }, [selectedCategory, categories]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data.data || data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Get all descendant category IDs
  const getAllDescendantCategoryIds = (categoryId) => {
    const descendants = [categoryId];
    const childCategories = categories.filter((cat) => {
      const parentId = getParentId(cat);
      return parentId === categoryId;
    });

    childCategories.forEach((child) => {
      descendants.push(...getAllDescendantCategoryIds(child._id));
    });

    return descendants;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const categoryId = selectedCategory || searchParams.get("category") || "";

      let categoryIds = categoryId;
      if (categoryId && categories.length > 0) {
        const allIds = getAllDescendantCategoryIds(categoryId);
        categoryIds = allIds.join(",");
      }

      const params = {
        page: searchParams.get("page") || 1,
        search: searchParams.get("search") || "",
        category: categoryIds,
        sort: selectedSort,
        minPrice: selectedRange.min || "",
        maxPrice: selectedRange.max || "",
      };

      const data = await productService.getAllProducts(params);
      setProducts(data.data);
      setPagination({
        page: data.currentPage,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getParentId = (category) => {
    if (!category.parentCategory) return null;
    return typeof category.parentCategory === "object"
      ? category.parentCategory._id
      : category.parentCategory;
  };

  const buildCategoryBreadcrumbs = (categoryId) => {
    const breadcrumbs = [];
    let currentCategory = categories.find((cat) => cat._id === categoryId);
    let depth = 0;
    const maxDepth = 10;

    while (currentCategory && depth < maxDepth) {
      breadcrumbs.unshift({
        id: currentCategory._id,
        name: currentCategory.name,
        slug: currentCategory.slug,
      });

      const parentId = getParentId(currentCategory);
      if (!parentId) break;

      currentCategory = categories.find((cat) => cat._id === parentId);
      depth++;
    }

    return breadcrumbs;
  };

  const handlePageChange = (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      searchParams.set("category", categoryId);
    } else {
      searchParams.delete("category");
    }
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const handleSortChange = (sortValue) => {
    setSelectedSort(sortValue);
    searchParams.set("sort", sortValue);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory("");
    searchParams.delete("category");
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedRange({ min: "", max: "" });
    setSelectedSort("newest");
    searchParams.delete("category");
    searchParams.delete("sort");
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const hasActiveFilters =
    selectedCategory ||
    selectedRange.min ||
    selectedRange.max ||
    selectedSort !== "newest";

  const activeFiltersCount = [
    selectedCategory,
    selectedRange.min || selectedRange.max,
    selectedSort !== "newest",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container px-4 mx-auto">
        {/* Modern Breadcrumbs */}
        <nav className="flex flex-wrap items-center px-6 py-4 mb-8 space-x-2 text-sm bg-white border border-gray-100 shadow-sm rounded-2xl">
          <Link
            to="/"
            className="flex items-center gap-2 px-2 py-1 text-gray-500 transition-all rounded-lg hover:text-primary-600 hover:scale-105 hover:bg-primary-50"
          >
            <FaHome className="text-primary-600" />
            <span className="font-medium">Home</span>
          </Link>
          <FaChevronRight className="text-gray-300" size={12} />
          <button
            onClick={clearCategoryFilter}
            className={`${
              categoryBreadcrumbs.length === 0
                ? "text-primary-600 font-bold bg-primary-50"
                : "text-gray-500 hover:text-primary-600 hover:bg-gray-50"
            } transition-all px-3 py-1 rounded-lg`}
          >
            Shop
          </button>

          {categoryBreadcrumbs.map((category, index) => (
            <React.Fragment key={category.id}>
              <FaChevronRight className="text-gray-300" size={12} />
              {index === categoryBreadcrumbs.length - 1 ? (
                <span className="px-3 py-1 font-bold rounded-lg text-primary-600 bg-primary-50">
                  {category.name}
                </span>
              ) : (
                <button
                  onClick={() => handleCategoryChange(category.id)}
                  className="px-3 py-1 text-gray-500 transition-all rounded-lg hover:text-primary-600 hover:bg-gray-50"
                >
                  {category.name}
                </button>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Page Header with Gradient */}
        <div className="relative p-8 mb-10 overflow-hidden shadow-xl bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 bg-white rounded-full opacity-5"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 -mb-24 -ml-24 bg-white rounded-full opacity-5"></div>
          <div className="relative z-10">
            <h1 className="mb-3 font-serif text-4xl font-bold text-white md:text-5xl">
              {categoryBreadcrumbs.length > 0
                ? categoryBreadcrumbs[categoryBreadcrumbs.length - 1].name
                : "Shop All Products"}
            </h1>
            {categoryBreadcrumbs.length > 0 ? (
              <p className="text-lg text-primary-100">
                Browse our collection of{" "}
                {categoryBreadcrumbs[
                  categoryBreadcrumbs.length - 1
                ].name.toLowerCase()}{" "}
                products
              </p>
            ) : (
              <p className="text-lg text-primary-100">
                Discover our complete collection
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center justify-center w-full gap-3 px-6 py-4 font-semibold text-white transition-all shadow-lg bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl hover:shadow-xl group"
            >
              <div className="relative">
                <FaFilter className="transition-transform group-hover:rotate-12" />
                {activeFiltersCount > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold bg-yellow-400 rounded-full -top-2 -right-2 text-primary-900 animate-pulse">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Filters Sidebar - Enhanced */}
          <aside
            className={`lg:w-80 space-y-6 ${
              showMobileFilters ? "block" : "hidden lg:block"
            }`}
          >
            {/* Filter Header */}
            <div className="p-6 text-white shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                    <FaFilter className="text-xl" />
                  </div>
                  <h3 className="text-xl font-bold">Filters</h3>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm transition-all rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  >
                    <FaTimes size={12} />
                    Clear All
                  </button>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <p className="text-sm text-white/70">
                  {activeFiltersCount}{" "}
                  {activeFiltersCount === 1 ? "filter" : "filters"} active
                </p>
              )}
            </div>

            {/* Sort Filter Card */}
            <div className="p-6 transition-all bg-white border-2 border-gray-100 shadow-lg rounded-2xl hover:border-primary-200">
              <SortFilter
                selectedSort={selectedSort}
                onSortChange={handleSortChange}
              />
            </div>

            {/* Price Filter Card */}
            <div className="p-6 transition-all bg-white border-2 border-gray-100 shadow-lg rounded-2xl hover:border-primary-200">
              <PriceFilter
                selectedRange={selectedRange}
                onRangeChange={handleRangeChange}
              />
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="p-5 border-2 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border-primary-200">
                <h4 className="flex items-center gap-2 mb-3 font-bold text-primary-900">
                  <FaThLarge className="text-primary-600" />
                  Active Filters
                </h4>
                <div className="space-y-2">
                  {selectedCategory && categoryBreadcrumbs.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                      <span className="text-sm text-gray-700">
                        Category:{" "}
                        <strong>
                          {
                            categoryBreadcrumbs[categoryBreadcrumbs.length - 1]
                              .name
                          }
                        </strong>
                      </span>
                      <button
                        onClick={clearCategoryFilter}
                        className="p-1 text-red-500 transition-all rounded-lg hover:text-red-700 hover:bg-red-50"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  )}
                  {(selectedRange.min || selectedRange.max) && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                      <span className="text-sm text-gray-700">
                        Price:{" "}
                        <strong>
                          ${selectedRange.min || "0"} - $
                          {selectedRange.max || "∞"}
                        </strong>
                      </span>
                      <button
                        onClick={() => handleRangeChange({ min: "", max: "" })}
                        className="p-1 text-red-500 transition-all rounded-lg hover:text-red-700 hover:bg-red-50"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* Products Section */}
          <div className="flex-1">
            {/* Results Count & Quick Sort Bar */}
            {!loading && (
              <div className="p-6 mb-6 bg-white border border-gray-100 shadow-md rounded-2xl">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      <span className="text-primary-600">
                        {products.length}
                      </span>{" "}
                      {products.length === 1 ? "Product" : "Products"} Found
                    </p>
                    {selectedCategory && categoryBreadcrumbs.length > 0 && (
                      <p className="mt-1 text-sm text-gray-500">
                        in{" "}
                        {
                          categoryBreadcrumbs[categoryBreadcrumbs.length - 1]
                            .name
                        }
                      </p>
                    )}
                  </div>

                  {/* Quick Sort Dropdown */}
                  <div className="items-center hidden gap-3 sm:flex">
                    <FaBars className="text-gray-400" />
                    <select
                      value={selectedSort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="border-2 border-gray-200 rounded-xl px-5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white hover:border-primary-300 transition-all cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="name_asc">Name: A to Z</option>
                      <option value="name_desc">Name: Z to A</option>
                      <option value="rating">Best Rated</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <ProductGrid products={products} loading={loading} />

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="py-20 text-center bg-white shadow-lg rounded-3xl">
                <div className="mb-6">
                  <div className="mb-4 text-8xl animate-bounce">📦</div>
                  <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  No products found
                  {selectedCategory && " in this category"}
                </h3>
                <p className="max-w-md mx-auto mb-8 text-gray-500">
                  We couldn't find any products matching your criteria. Try
                  adjusting your filters or browse our full collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-white transition-all shadow-lg bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:shadow-xl hover:scale-105"
                >
                  <FaTimes />
                  Clear All Filters
                </button>
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
