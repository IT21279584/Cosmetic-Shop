import React, { useState } from "react";
import {
  FaTimes,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
  FaMinus,
  FaPlus,
  FaCheck,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaTag,
} from "react-icons/fa";

// Mock functions for demo
const formatPrice = (price) => `$${price?.toFixed(2) || "0.00"}`;
const useCart = () => ({
  addToCart: (product, qty) => console.log("Added to cart:", product, qty),
});
const useWishlist = () => ({
  isInWishlist: () => false,
  addToWishlist: (product) => console.log("Added to wishlist:", product),
  removeFromWishlist: (id) => console.log("Removed from wishlist:", id),
});

const QuickView = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  if (!isOpen) return null;

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleQuantityChange = (value) => {
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  // Helper function to format product name with weight
  const getProductTitle = () => {
    if (product.weight?.value) {
      return `${product.name} ${product.weight.value}${product.weight.unit}`;
    }
    return product.name;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black bg-opacity-50 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-white rounded-lg sm:rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute z-10 p-1.5 sm:p-2 text-gray-600 transition-all bg-white rounded-full shadow-lg hover:bg-gray-100 hover:scale-110 top-2 right-2 sm:top-4 sm:right-4"
        >
          <FaTimes size={18} className="sm:w-5 sm:h-5" />
        </button>

        <div className="grid gap-4 p-3 sm:gap-6 sm:p-6 md:p-8 md:grid-cols-2">
          {/* Left Column - Images */}
          <div className="space-y-3 sm:space-y-4">
            {/* Badges */}
            <div className="absolute z-10 flex flex-col gap-1.5 sm:gap-2 top-6 left-6 sm:top-10 sm:left-10">
              {discount > 0 && (
                <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-lg bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                  -{discount}% OFF
                </div>
              )}
              {product.isFeatured && (
                <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold text-gray-900 shadow-lg bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg">
                  Featured
                </div>
              )}
            </div>

            {/* Main Image with Navigation */}
            <div
              className="relative overflow-hidden bg-gray-100 rounded-lg sm:rounded-xl group"
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src={
                  product.images?.[selectedImage]?.url ||
                  "https://via.placeholder.com/600"
                }
                alt={product.name}
                className="object-cover w-full h-full"
              />

              {/* Navigation Arrows */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute p-1 sm:p-1.5 transition-all transform -translate-y-1/2 bg-white/90 rounded-full shadow-lg left-2 sm:left-3 top-1/2 hover:scale-110 hover:bg-white"
                  >
                    <FaChevronLeft className="text-gray-700" size={12} />
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute p-1 sm:p-1.5 transition-all transform -translate-y-1/2 bg-white/90 rounded-full shadow-lg right-2 sm:right-3 top-1/2 hover:scale-110 hover:bg-white"
                  >
                    <FaChevronRight className="text-gray-700" size={12} />
                  </button>

                  <div className="absolute px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white bg-black rounded-full bottom-2 sm:bottom-3 right-2 sm:right-3 bg-opacity-70">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-md sm:rounded-lg overflow-hidden transition-all duration-300 ${
                      selectedImage === idx
                        ? "ring-2 sm:ring-3 ring-primary-500 scale-105 shadow-md"
                        : "ring-1 sm:ring-2 ring-gray-200 hover:ring-primary-300 hover:scale-105"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-3 sm:space-y-4">
            {/* Product Name with Weight */}
            <div>
              <h2 className="mb-1 text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
                {getProductTitle()}
              </h2>
              {product.sku && (
                <p className="font-mono text-[10px] sm:text-xs text-gray-500">
                  SKU: {product.sku}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={14}
                    className={`sm:w-4 sm:h-4 ${
                      i < Math.round(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 sm:text-sm">
                ({product.numReviews} reviews)
              </span>
            </div>

            {/* Price Section */}
            <div className="overflow-hidden border-2 rounded-lg shadow-sm sm:rounded-xl border-primary-100">
              <div className="p-3 sm:p-4">
                <div className="flex flex-wrap items-end justify-between gap-2 sm:gap-3">
                  <div>
                    <p className="mb-1 text-[10px] sm:text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Price
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold sm:text-2xl lg:text-3xl text-primary-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.comparePrice && (
                        <span className="text-sm text-gray-400 line-through sm:text-base">
                          {formatPrice(product.comparePrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  {discount > 0 && (
                    <div className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-white shadow-md bg-gradient-to-r from-red-500 to-red-600 rounded-lg sm:rounded-xl">
                      <p className="text-[10px] sm:text-xs font-semibold">
                        You Save
                      </p>
                      <p className="text-base font-bold sm:text-lg">
                        {discount}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {discount > 0 && (
                <div className="px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-center bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700">
                  Save {formatPrice(product.comparePrice - product.price)} on
                  this purchase
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="p-2 sm:p-2.5 border-2 border-gray-100 shadow-sm rounded-lg sm:rounded-xl">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-green-600 sm:text-sm">
                    In Stock
                  </span>
                  {product.stock <= 10 && (
                    <span className="px-1.5 sm:px-2 py-0.5 ml-auto text-[10px] sm:text-xs font-bold text-orange-700 bg-orange-100 rounded-lg">
                      Only {product.stock} left!
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-red-600 sm:text-sm">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="p-2.5 sm:p-3 text-xs sm:text-sm leading-relaxed text-gray-600 border-l-4 bg-gradient-to-r from-gray-50 to-white rounded-lg sm:rounded-xl border-primary-500">
                {product.shortDescription}
              </p>
            )}

            {/* Quantity & Actions */}
            <div className="p-2.5 sm:p-3 space-y-2 sm:space-y-3 border-2 border-gray-100 shadow-sm rounded-lg sm:rounded-xl">
              <label className="block text-[10px] sm:text-xs font-bold text-gray-900 uppercase">
                Quantity
              </label>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {/* Quantity Selector */}
                <div className="flex items-center bg-gray-100 border-2 border-gray-200 rounded-lg sm:rounded-xl">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 transition-all rounded-l-lg sm:p-2 hover:bg-gray-200 sm:rounded-l-xl disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <FaMinus className="text-gray-700" size={10} />
                  </button>
                  <span className="px-3 sm:px-4 py-2 text-sm sm:text-base font-bold text-gray-900 min-w-[40px] sm:min-w-[45px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 transition-all rounded-r-lg sm:p-2 hover:bg-gray-200 sm:rounded-r-xl disabled:opacity-50"
                    disabled={quantity >= product.stock}
                  >
                    <FaPlus className="text-gray-700" size={10} />
                  </button>
                </div>

                <div className="flex items-center flex-1 gap-2">
                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex items-center justify-center flex-1 gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition-all bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg sm:rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaShoppingCart size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">
                      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </span>
                    <span className="xs:hidden">
                      {product.stock > 0 ? "Add" : "Out"}
                    </span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all hover:scale-110 ${
                      inWishlist
                        ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {inWishlist ? (
                      <FaHeart size={16} className="sm:w-[18px] sm:h-[18px]" />
                    ) : (
                      <FaRegHeart
                        size={16}
                        className="sm:w-[18px] sm:h-[18px]"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Category & Brand */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {product.category && (
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold border-2 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 rounded-lg sm:rounded-xl border-primary-200">
                  {product.category.name || product.category}
                </span>
              )}
              {product.brand && (
                <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-white border-2 border-gray-100 shadow-sm rounded-lg sm:rounded-xl">
                  <FaTag className="text-primary-600" size={10} />
                  <span className="font-medium text-gray-700">
                    {product.brand}
                  </span>
                </div>
              )}
            </div>

            {/* Features Icons */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <div className="p-2 sm:p-2.5 text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl">
                <FaTruck className="w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-0.5 sm:mb-1 text-blue-600" />
                <p className="text-[10px] sm:text-xs font-semibold text-blue-900">
                  Free Ship
                </p>
              </div>
              <div className="p-2 sm:p-2.5 text-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl">
                <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-0.5 sm:mb-1 text-green-600" />
                <p className="text-[10px] sm:text-xs font-semibold text-green-900">
                  Secure
                </p>
              </div>
              <div className="p-2 sm:p-2.5 text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl">
                <FaUndo className="w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-0.5 sm:mb-1 text-purple-600" />
                <p className="text-[10px] sm:text-xs font-semibold text-purple-900">
                  Returns
                </p>
              </div>
            </div>

            {/* Tabbed Content */}
            {(product.description ||
              product.features ||
              product.ingredients ||
              product.howToUse) && (
              <div className="pt-2 border-t-2 border-gray-100 sm:pt-3">
                {/* Tabs */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                  {product.description && (
                    <button
                      onClick={() => setActiveTab("description")}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded-md sm:rounded-lg font-semibold transition-all ${
                        activeTab === "description"
                          ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Description
                    </button>
                  )}
                  {product.features?.length > 0 && (
                    <button
                      onClick={() => setActiveTab("features")}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded-md sm:rounded-lg font-semibold transition-all ${
                        activeTab === "features"
                          ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Features
                    </button>
                  )}
                  {product.ingredients && (
                    <button
                      onClick={() => setActiveTab("ingredients")}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded-md sm:rounded-lg font-semibold transition-all ${
                        activeTab === "ingredients"
                          ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Ingredients
                    </button>
                  )}
                  {product.howToUse && (
                    <button
                      onClick={() => setActiveTab("howToUse")}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded-md sm:rounded-lg font-semibold transition-all ${
                        activeTab === "howToUse"
                          ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      How to Use
                    </button>
                  )}
                </div>

                {/* Tab Content */}
                <div className="overflow-y-auto max-h-32 sm:max-h-40">
                  {activeTab === "description" && product.description && (
                    <div className="text-[11px] sm:text-xs leading-relaxed text-gray-700">
                      {product.description}
                    </div>
                  )}

                  {activeTab === "features" && product.features?.length > 0 && (
                    <ul className="space-y-1 sm:space-y-1.5">
                      {product.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-gradient-to-r from-green-50 to-white"
                        >
                          <div className="flex items-center justify-center flex-shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 bg-green-500 rounded-full">
                            <FaCheck className="text-[8px] sm:text-xs text-white" />
                          </div>
                          <span className="text-[11px] sm:text-xs text-gray-700">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === "ingredients" && product.ingredients && (
                    <div className="p-2 border-l-4 border-blue-500 rounded-md sm:p-3 sm:rounded-lg bg-gradient-to-r from-blue-50 to-white">
                      <p className="text-[11px] sm:text-xs leading-relaxed text-gray-700">
                        {product.ingredients}
                      </p>
                    </div>
                  )}

                  {activeTab === "howToUse" && product.howToUse && (
                    <div className="p-2 border-l-4 border-purple-500 rounded-md sm:p-3 sm:rounded-lg bg-gradient-to-r from-purple-50 to-white">
                      <p className="text-[11px] sm:text-xs leading-relaxed text-gray-700">
                        {product.howToUse}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default QuickView;
