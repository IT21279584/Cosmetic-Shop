import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaUserCircle,
  FaBox,
  FaCog,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";
import categoryService from "../../services/categoryService";
import Input from "../common/Input";

const MAIN_CATEGORIES = [
  { id: "women", name: "Women", slug: "women" },
  { id: "men", name: "Men", slug: "men" },
  { id: "mother-baby", name: "Mother & Baby", slug: "mother-baby" },
  {
    id: "health-wellbeing",
    name: "Health & Wellbeing",
    slug: "health-wellbeing",
  },
  { id: "fragrance", name: "Fragrance", slug: "fragrance" },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [expandedMobileCategories, setExpandedMobileCategories] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      setExpandedMobileCategories({});
    }
  }, [mobileMenuOpen]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      const categories = response.data || response || [];
      setAllCategories(categories);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const getParentId = (category) => {
    if (!category.parentCategory) return null;
    return typeof category.parentCategory === "object"
      ? category.parentCategory._id
      : category.parentCategory;
  };

  const findCategoryByName = (categoryName) => {
    return allCategories.find(
      (cat) => cat.level === 0 && cat.name === categoryName
    );
  };

  const getSubcategoriesForMain = (mainCategoryId) => {
    if (!mainCategoryId) return [];

    const subcats = allCategories.filter((cat) => {
      if (cat.level === 0) return false;
      let current = cat;
      let depth = 0;

      while (current && depth < 10) {
        const parentId = getParentId(current);
        if (!parentId) return false;
        if (parentId === mainCategoryId) return true;
        current = allCategories.find((c) => c._id === parentId);
        depth++;
      }
      return false;
    });

    const grouped = {};
    subcats.forEach((cat) => {
      if (cat.level === 1) {
        if (!grouped[cat._id]) {
          grouped[cat._id] = { category: cat, children: [] };
        }
      } else {
        let current = cat;
        let depth = 0;

        while (current && depth < 10) {
          const parentId = getParentId(current);
          if (!parentId) break;
          const parent = allCategories.find((c) => c._id === parentId);
          if (!parent) break;

          if (parent.level === 1) {
            if (!grouped[parent._id]) {
              grouped[parent._id] = { category: parent, children: [] };
            }
            grouped[parent._id].children.push(cat);
            break;
          }
          current = parent;
          depth++;
        }
      }
    });

    return Object.values(grouped);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileCategory = (categoryId) => {
    setExpandedMobileCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <nav
      className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg" : "shadow-md"
      }`}
    >
      <div className="container px-4 mx-auto">
        {/* Top Bar */}
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "py-3" : "py-4"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-12 h-12 transition-transform duration-300 shadow-lg bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl group-hover:scale-110">
              <span className="text-2xl font-bold text-white">E</span>
            </div>
            <div className="flex-col hidden sm:flex">
              <span className="text-xl font-bold tracking-tight text-gray-900">
                essentials
              </span>
              <span className="text-xs font-medium text-primary-600">
                beautiful everyday
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="flex-1 hidden max-w-2xl mx-8 md:flex"
          >
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-12 pr-4 transition-all bg-white border border-gray-300 outline-none rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <FaSearch
                className="absolute transition-colors transform -translate-y-1/2 pointer-events-none left-4 top-1/2 text-primary-600"
                size={20}
              />
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Wishlist */}
            <Link
              to="/profile/wishlist"
              className="relative p-3 text-gray-700 transition-all hover:text-primary-600 hover:bg-primary-50 rounded-xl group"
            >
              <FaHeart
                size={20}
                className="transition-transform group-hover:scale-110"
              />
              {wishlistCount > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full shadow-md -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-600 animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-3 text-gray-700 transition-all hover:text-primary-600 hover:bg-primary-50 rounded-xl group"
            >
              <FaShoppingCart
                size={20}
                className="transition-transform group-hover:scale-110"
              />
              {cartItemsCount > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full shadow-md -top-1 -right-1 bg-gradient-to-br from-primary-500 to-primary-700 animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu - Desktop */}
            {isAuthenticated ? (
              <div className="relative hidden md:block group">
                <button className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700">
                    <FaUser size={14} className="text-white" />
                  </div>
                  <span className="hidden font-medium lg:block">
                    {user?.name}
                  </span>
                  <FaChevronDown
                    size={12}
                    className="transition-transform duration-300 group-hover:rotate-180"
                  />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 invisible w-64 py-2 mt-2 transition-all duration-300 transform translate-y-2 bg-white border-2 border-gray-100 shadow-2xl opacity-0 rounded-2xl group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all hover:bg-primary-50 hover:text-primary-700 group/item"
                  >
                    <FaUserCircle className="transition-transform text-primary-600 group-hover/item:scale-110" />
                    <span className="font-medium">My Profile</span>
                  </Link>

                  <Link
                    to="/profile/orders"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all hover:bg-primary-50 hover:text-primary-700 group/item"
                  >
                    <FaBox className="transition-transform text-primary-600 group-hover/item:scale-110" />
                    <span className="font-medium">My Orders</span>
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all hover:bg-primary-50 hover:text-primary-700 group/item"
                    >
                      <FaCog className="transition-transform text-primary-600 group-hover/item:scale-110" />
                      <span className="font-medium">Admin Dashboard</span>
                    </Link>
                  )}

                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full gap-3 px-4 py-3 text-red-600 transition-all hover:bg-red-50 group/item"
                    >
                      <FaSignOutAlt className="transition-transform group-hover/item:scale-110" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                <FaUser size={14} />
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 text-gray-700 transition-all md:hidden hover:text-primary-600 hover:bg-primary-50 rounded-xl"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="items-center hidden py-3 space-x-1 border-t border-gray-100 md:flex">
          <Link
            to="/"
            className="px-4 py-2 font-medium text-gray-700 transition-all hover:text-primary-600 hover:bg-primary-50 rounded-xl"
          >
            Home
          </Link>

          <Link
            to="/shop"
            className="px-4 py-2 font-medium text-gray-700 transition-all hover:text-primary-600 hover:bg-primary-50 rounded-xl"
          >
            Shop
          </Link>

          {/* Category Dropdowns */}
          {MAIN_CATEGORIES.map((mainCat) => {
            const backendCategory = findCategoryByName(mainCat.name);
            const subcategories = backendCategory
              ? getSubcategoriesForMain(backendCategory._id)
              : [];

            return (
              <div
                key={mainCat.id}
                className="relative group"
                onMouseEnter={() => setHoveredCategory(mainCat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link
                  to={
                    backendCategory
                      ? `/shop?category=${backendCategory._id}`
                      : `/shop`
                  }
                  className="flex items-center gap-1.5 px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-medium rounded-xl transition-all"
                >
                  <span>{mainCat.name}</span>
                  {subcategories.length > 0 && (
                    <FaChevronDown
                      size={12}
                      className="transition-transform duration-300 group-hover:rotate-180"
                    />
                  )}
                </Link>

                {/* Mega Menu */}
                {subcategories.length > 0 && hoveredCategory === mainCat.id && (
                  <div className="absolute left-0 z-50 invisible w-screen max-w-5xl mt-2 transition-all duration-300 transform translate-y-2 bg-white border-2 border-gray-100 shadow-2xl opacity-0 top-full rounded-3xl group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                    <div className="grid grid-cols-3 gap-8 p-8">
                      {subcategories.map((group) => (
                        <div key={group.category._id} className="space-y-3">
                          <h3 className="pb-2 text-sm font-bold tracking-wide text-gray-900 uppercase border-b-2 border-primary-500">
                            <Link
                              to={`/shop?category=${group.category._id}`}
                              className="transition-colors hover:text-primary-600"
                            >
                              {group.category.name}
                            </Link>
                          </h3>
                          <ul className="space-y-2">
                            {group.children.map((child) => (
                              <li key={child._id}>
                                <Link
                                  to={`/shop?category=${child._id}`}
                                  className="flex items-center gap-2 text-sm text-gray-600 transition-all hover:text-primary-600 hover:translate-x-1 group/link"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover/link:opacity-100 transition-opacity"></span>
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <Link
            to="/about"
            className="px-4 py-2 font-medium text-gray-700 transition-all hover:text-primary-600 hover:bg-primary-50 rounded-xl"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="px-4 py-2 font-medium text-gray-700 transition-all hover:text-primary-600 hover:bg-primary-50 rounded-xl"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slideDown max-h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide">
            {/* Search - Mobile */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 pl-12 pr-4 transition-all border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 focus:bg-white"
                />
                <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
              </div>
            </form>

            {/* Links - Mobile */}
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="px-4 py-3 font-medium text-gray-700 transition-all hover:text-primary-600 hover:bg-primary-50 rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="px-4 py-3 font-medium text-gray-700 transition-all hover:text-primary-600 hover:bg-primary-50 rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>

              {/* Mobile Categories */}
              {MAIN_CATEGORIES.map((mainCat) => {
                const backendCategory = findCategoryByName(mainCat.name);
                const subcategories = backendCategory
                  ? getSubcategoriesForMain(backendCategory._id)
                  : [];
                const isExpanded =
                  expandedMobileCategories[mainCat.id] || false;
                const hasSubcategories = subcategories.length > 0;

                return (
                  <div key={mainCat.id}>
                    {hasSubcategories ? (
                      <div className="flex items-center overflow-hidden bg-gray-50 rounded-xl">
                        <Link
                          to={
                            backendCategory
                              ? `/shop?category=${backendCategory._id}`
                              : `/shop`
                          }
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 px-4 py-3 font-medium text-gray-700 transition-colors hover:text-primary-600"
                        >
                          {mainCat.name}
                        </Link>
                        <button
                          onClick={() => toggleMobileCategory(mainCat.id)}
                          className="px-4 py-3 text-gray-500 transition-all hover:text-primary-600"
                        >
                          <FaChevronRight
                            size={14}
                            className="transition-transform duration-300"
                            style={{
                              transform: isExpanded
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                            }}
                          />
                        </button>
                      </div>
                    ) : (
                      <Link
                        to={
                          backendCategory
                            ? `/shop?category=${backendCategory._id}`
                            : `/shop`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 font-medium text-gray-700 transition-all hover:text-primary-600 hover:bg-primary-50 rounded-xl"
                      >
                        {mainCat.name}
                      </Link>
                    )}

                    {hasSubcategories && isExpanded && (
                      <div className="pl-4 mt-2 mb-2 ml-4 space-y-1 border-l-2 border-primary-300 animate-slideDown">
                        {subcategories.map((group) => (
                          <div key={group.category._id}>
                            <Link
                              to={`/shop?category=${group.category._id}`}
                              className="block px-3 py-2 text-sm font-semibold text-gray-800 transition-all rounded-lg hover:text-primary-600 hover:bg-primary-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {group.category.name}
                            </Link>
                            {group.children.length > 0 && (
                              <div className="mt-1 ml-3 space-y-1">
                                {group.children.map((child) => (
                                  <Link
                                    key={child._id}
                                    to={`/shop?category=${child._id}`}
                                    className="flex items-center px-3 py-1.5 text-xs text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    <span className="w-1 h-1 mr-2 rounded-full bg-primary-500"></span>
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <Link
                to="/about"
                className="px-4 py-3 font-medium text-gray-700 transition-all hover:text-primary-600 hover:bg-primary-50 rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="px-4 py-3 font-medium text-gray-700 transition-all hover:text-primary-600 hover:bg-primary-50 rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile Auth */}
              <div className="pt-4 mt-4 mb-4 space-y-2 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <div className="p-4 mb-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
                      <p className="font-semibold text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all bg-gray-50 hover:bg-gray-100 rounded-xl"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaUserCircle className="text-primary-600" />
                      <span className="font-medium">My Profile</span>
                    </Link>

                    <Link
                      to="/profile/orders"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all bg-gray-50 hover:bg-gray-100 rounded-xl"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaBox className="text-primary-600" />
                      <span className="font-medium">My Orders</span>
                    </Link>

                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-3 transition-all text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <FaCog />
                        <span className="font-medium">Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full gap-3 px-4 py-3 text-white transition-all bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:shadow-lg"
                    >
                      <FaSignOutAlt />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-3 font-semibold text-center transition-all bg-white border-2 text-primary-700 border-primary-600 rounded-xl hover:bg-primary-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-3 mt-3 font-semibold text-center text-white transition-all bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:shadow-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
