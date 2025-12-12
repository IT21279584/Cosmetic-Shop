import React, { useState } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaMapMarkerAlt,
  FaLock,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import ProfileInfo from "../components/profile/ProfileInfo";
import OrderHistory from "../components/profile/OrderHistory";
import OrderDetails from "../components/profile/OrderDetails";
import AddressBook from "../components/profile/AddressBook";
import Wishlist from "../components/profile/Wishlist";
import ChangePassword from "../components/profile/ChangePassword";

const Profile = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "profile", label: "Profile Info", icon: FaUser, path: "/profile" },
    {
      id: "orders",
      label: "My Orders",
      icon: FaShoppingBag,
      path: "/profile/orders",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: FaHeart,
      path: "/profile/wishlist",
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: FaMapMarkerAlt,
      path: "/profile/addresses",
    },
    {
      id: "password",
      label: "Change Password",
      icon: FaLock,
      path: "/profile/password",
    },
  ];

  const isActive = (path) => {
    if (path === "/profile") {
      return location.pathname === "/profile";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen py-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 lg:py-12">
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                <FaUser className="text-lg text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 lg:text-4xl">
                  My Account
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your profile and orders
                </p>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 transition-colors lg:hidden hover:text-primary-600"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky p-6 bg-white shadow-xl rounded-2xl top-24">
              {/* User Profile Card */}
              <div className="pb-6 mb-6 text-center border-b-2 border-gray-100">
                <div className="relative inline-block mb-4">
                  <div className="flex items-center justify-center w-20 h-20 shadow-lg bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl">
                    <span className="text-3xl font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute w-6 h-6 bg-green-500 border-4 border-white rounded-full -bottom-1 -right-1"></div>
                </div>
                <h3 className="mb-1 text-lg font-bold text-gray-900">
                  {user?.name}
                </h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                        active
                          ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105"
                          : "text-gray-700 hover:bg-gray-50 hover:scale-102"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Mobile Sidebar */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div
                className="absolute top-0 left-0 w-80 max-w-[85%] h-full bg-white shadow-2xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  {/* Close Button */}
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute p-2 text-gray-600 top-4 right-4 hover:text-primary-600"
                  >
                    <FaTimes size={20} />
                  </button>

                  {/* User Profile Card */}
                  <div className="pb-6 mb-6 text-center border-b-2 border-gray-100">
                    <div className="relative inline-block mb-4">
                      <div className="flex items-center justify-center w-20 h-20 shadow-lg bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl">
                        <span className="text-3xl font-bold text-white">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute w-6 h-6 bg-green-500 border-4 border-white rounded-full -bottom-1 -right-1"></div>
                    </div>
                    <h3 className="mb-1 text-lg font-bold text-gray-900">
                      {user?.name}
                    </h3>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>

                  {/* Navigation Menu */}
                  <nav className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      return (
                        <Link
                          key={item.id}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                            active
                              ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Icon size={18} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-xl min-h-[600px] overflow-hidden">
              <Routes>
                <Route path="/" element={<ProfileInfo />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/orders/:orderId" element={<OrderDetails />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/addresses" element={<AddressBook />} />
                <Route path="/password" element={<ChangePassword />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
