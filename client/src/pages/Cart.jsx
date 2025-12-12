import React from "react";
import { Link } from "react-router-dom";
import {
  FaTrash,
  FaShoppingBag,
  FaArrowRight,
  FaTag,
  FaTruck,
  FaShieldAlt,
  FaMinus,
  FaPlus,
  FaPercent,
} from "react-icons/fa";
import useCart from "../hooks/useCart";
import { formatPrice } from "../utils/helpers";
import Button from "../components/common/Button";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-50 via-white to-primary-50">
        <div className="max-w-md text-center">
          {/* Animated Empty Cart Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 rounded-full opacity-50 bg-primary-100 blur-2xl animate-pulse"></div>
            <div className="relative flex items-center justify-center w-32 h-32 rounded-full shadow-2xl bg-gradient-to-br from-primary-500 to-primary-600">
              <FaShoppingBag className="text-5xl text-white" />
            </div>
          </div>

          <h2 className="mb-3 text-3xl font-bold text-gray-900">
            Your Cart is Empty
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Looks like you haven't added anything yet. Start shopping to fill it
            up!
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 font-bold text-white transition-all shadow-lg bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl hover:shadow-xl hover:scale-105"
          >
            <FaShoppingBag />
            Start Shopping
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </div>
    );
  }

  const savings = cart.items.reduce((total, item) => {
    if (item.product.comparePrice) {
      return total + (item.product.comparePrice - item.price) * item.quantity;
    }
    return total;
  }, 0);

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 lg:py-12">
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
              <FaShoppingBag className="text-lg text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 lg:text-4xl">
              Shopping Cart
            </h1>
          </div>
          <p className="text-gray-600 ml-13">
            {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Cart Items - Mobile First */}
          <div className="space-y-4 lg:col-span-8">
            {/* Benefits Banner */}
            <div className="p-4 mb-4 bg-gradient-to-r from-blue-50 to-primary-50 rounded-2xl">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="flex flex-col items-center gap-1">
                  <FaTruck className="text-xl text-blue-600" />
                  <p className="text-xs font-semibold text-gray-700">
                    Free Shipping
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <FaShieldAlt className="text-xl text-green-600" />
                  <p className="text-xs font-semibold text-gray-700">
                    Secure Payment
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <FaTag className="text-xl text-purple-600" />
                  <p className="text-xs font-semibold text-gray-700">
                    Best Prices
                  </p>
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
              {cart.items.map((item, index) => (
                <div
                  key={item._id}
                  className={`p-4 lg:p-6 ${
                    index !== cart.items.length - 1
                      ? "border-b-2 border-gray-100"
                      : ""
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {/* Product Image */}
                    <Link
                      to={`/product/${item.product._id}`}
                      className="relative flex-shrink-0 group"
                    >
                      <div className="w-full overflow-hidden transition-shadow bg-gray-100 shadow-md sm:w-28 sm:h-28 aspect-square rounded-xl group-hover:shadow-xl">
                        <img
                          src={
                            item.product.images[0]?.url ||
                            "https://via.placeholder.com/150"
                          }
                          alt={item.product.name}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      {item.product.comparePrice && (
                        <div className="absolute px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-lg shadow-lg -top-2 -right-2">
                          SALE
                        </div>
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product._id}`}
                            className="text-base font-bold text-gray-900 transition-colors hover:text-primary-600 lg:text-lg line-clamp-2"
                          >
                            {item.product.name}
                          </Link>

                          {/* Price Info */}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-lg font-bold text-primary-600">
                              {formatPrice(item.price)}
                            </span>
                            {item.product.comparePrice && (
                              <>
                                <span className="text-sm text-gray-400 line-through">
                                  {formatPrice(item.product.comparePrice)}
                                </span>
                                <span className="px-2 py-1 text-xs font-bold text-red-600 rounded-lg bg-red-50">
                                  {Math.round(
                                    ((item.product.comparePrice - item.price) /
                                      item.product.comparePrice) *
                                      100
                                  )}
                                  % OFF
                                </span>
                              </>
                            )}
                          </div>

                          {/* Product Meta */}
                          {item.product.weight && (
                            <p className="mt-1 text-xs text-gray-500">
                              {item.product.weight.value}
                              {item.product.weight.unit}
                            </p>
                          )}
                        </div>

                        {/* Quantity & Actions - Desktop */}
                        <div className="flex-col items-end hidden gap-3 sm:flex">
                          {/* Quantity Selector */}
                          <div className="flex items-center bg-gray-100 border-2 border-gray-200 rounded-xl">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="p-2 transition-colors hover:bg-gray-200 rounded-l-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaMinus className="text-xs text-gray-700" />
                            </button>
                            <span className="px-4 py-2 font-bold text-gray-900 min-w-[50px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="p-2 transition-colors hover:bg-gray-200 rounded-r-xl"
                            >
                              <FaPlus className="text-xs text-gray-700" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-0.5">
                              Subtotal
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <FaTrash className="text-xs" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity & Actions - Mobile */}
                      <div className="mt-4 space-y-3 sm:hidden">
                        <div className="flex items-center justify-between">
                          {/* Quantity Selector */}
                          <div className="flex items-center bg-gray-100 border-2 border-gray-200 rounded-xl">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="p-2 transition-colors hover:bg-gray-200 rounded-l-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaMinus className="text-xs text-gray-700" />
                            </button>
                            <span className="px-4 py-2 font-bold text-gray-900 min-w-[50px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="p-2 transition-colors hover:bg-gray-200 rounded-r-xl"
                            >
                              <FaPlus className="text-xs text-gray-700" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-0.5">
                              Subtotal
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-semibold text-red-600 transition-colors bg-red-50 hover:bg-red-100 rounded-xl"
                        >
                          <FaTrash className="text-xs" />
                          Remove Item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping Link - Mobile */}
            <Link
              to="/shop"
              className="flex items-center justify-center w-full gap-2 py-3 font-semibold transition-all bg-white shadow-md lg:hidden text-primary-600 hover:text-primary-700 rounded-2xl hover:shadow-lg"
            >
              <FaShoppingBag />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary - Sticky on Desktop */}
          <div className="lg:col-span-4">
            <div className="p-6 space-y-6 bg-white shadow-xl rounded-2xl lg:sticky lg:top-24">
              <div className="flex items-center gap-2 pb-4 border-b-2 border-gray-100">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                  <FaTag className="text-sm text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Order Summary
                </h3>
              </div>

              {/* Savings Badge */}
              {savings > 0 && (
                <div className="p-3 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaPercent className="text-green-600" />
                      <span className="text-sm font-semibold text-green-900">
                        You're saving
                      </span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(savings)}
                    </span>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Subtotal ({cart.items.length} items)
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(cart.totalPrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-sm font-semibold text-green-600">
                    FREE
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-sm text-gray-500">
                    Calculated at checkout
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(cart.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link to="/checkout" className="block">
                <button className="flex items-center justify-center w-full gap-2 py-4 font-bold text-white transition-all shadow-lg bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:shadow-xl hover:scale-105">
                  Proceed to Checkout
                  <FaArrowRight />
                </button>
              </Link>

              {/* Continue Shopping Link - Desktop */}
              <Link
                to="/shop"
                className="items-center justify-center hidden w-full gap-2 py-3 font-semibold transition-colors lg:flex text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl"
              >
                <FaShoppingBag />
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="pt-4 border-t-2 border-gray-100">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaShieldAlt className="text-green-600" />
                    <span>Secure</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-1">
                    <FaTruck className="text-blue-600" />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
