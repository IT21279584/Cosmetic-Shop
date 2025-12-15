import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaTags,
  FaBars,
  FaTimes,
  FaChevronRight,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: FaTachometerAlt },
    { path: "/admin/products", label: "Products", icon: FaBox },
    { path: "/admin/orders", label: "Orders", icon: FaShoppingBag },
    { path: "/admin/customers", label: "Customers", icon: FaUsers },
    { path: "/admin/categories", label: "Categories", icon: FaTags },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Menu Button - Responsive sizing */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 p-2.5 sm:p-3 text-white transition-all shadow-lg lg:hidden top-3 left-3 sm:top-4 sm:left-4 bg-primary-600 rounded-lg sm:rounded-xl hover:bg-primary-700 active:scale-95"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <FaBars className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>

      {/* Overlay - Enhanced for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Responsive width */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-40
          transform transition-transform duration-300 ease-in-out
          w-64 sm:w-72 md:w-80 lg:w-72
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo/Brand - Responsive padding and sizing */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 sm:h-20 sm:px-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg shadow-md sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 sm:rounded-xl">
              <span className="text-base font-bold text-white sm:text-xl">
                C
              </span>
            </div>
            <Link to="/" className="cursor-pointer">
              <div>
                <h1 className="text-base font-bold text-gray-900 sm:text-lg">
                  CosmeticShop
                </h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Navigation - Responsive scrolling area */}
        <nav
          className="flex-1 p-3 space-y-1 overflow-y-auto sm:p-4"
          style={{ height: "calc(100vh - 8rem)" }}
        >
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center space-x-2.5 sm:space-x-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl transition-all group
                  ${
                    isActive
                      ? "bg-primary-50 text-primary-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <item.icon
                  className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 ${
                    isActive
                      ? "text-primary-600"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                />
                <span className="text-sm font-medium sm:text-base">
                  {item.label}
                </span>
                {isActive && <FaChevronRight className="ml-auto" size={12} />}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button - Responsive spacing */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 sm:p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 sm:px-4 sm:py-3 space-x-2.5 sm:space-x-3 text-red-600 transition-colors hover:bg-red-50 rounded-lg sm:rounded-xl group"
          >
            <FaSignOutAlt className="w-4 h-4 transition-transform sm:w-5 sm:h-5 group-hover:scale-110" />
            <span className="text-sm font-medium sm:text-base">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
