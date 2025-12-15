import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaWeight,
  FaTag,
  FaHome,
  FaChevronRight,
  FaChevronLeft,
  FaMinus,
  FaPlus,
  FaCheck,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaThumbsUp,
} from "react-icons/fa";
import productService from "../services/productService";
import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";
import useAuth from "../hooks/useAuth";
import { formatPrice } from "../utils/helpers";
import { toast } from "react-toastify";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import ImageGallery from "../components/common/ImageGallery";
import ProductReviews from "../components/products/ProductReviews";

const ProductDetails = () => {
  const { slugOrId, id } = useParams();
  const navigate = useNavigate();
  const productId = slugOrId || id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [slugOrId]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getProduct(slugOrId);
      setProduct(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!product) return <div>Product not found</div>;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
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

  const inWishlist = isInWishlist(product._id);
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
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container px-4 mx-auto">
        {/* Modern Breadcrumb */}
        <nav className="flex items-center px-6 py-3 mb-6 space-x-2 text-sm bg-white shadow-sm rounded-2xl">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-1 text-gray-500 transition-all rounded-lg hover:text-primary-600 hover:scale-105 hover:bg-primary-50"
          >
            <FaHome className="text-primary-600" size={14} />
            <span className="font-medium">Home</span>
          </button>
          <FaChevronRight className="text-gray-300" size={10} />
          <button
            onClick={() => navigate("/shop")}
            className="px-3 py-1 text-gray-500 transition-all rounded-lg hover:text-primary-600 hover:bg-gray-50"
          >
            Shop
          </button>
          <FaChevronRight className="text-gray-300" size={10} />
          <span className="max-w-xs px-3 py-1 text-sm font-bold truncate rounded-lg text-primary-600 bg-primary-50">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-12">
          {/* Images Section - First on mobile, Left on desktop */}
          <div className="lg:col-span-5">
            <div className="p-5 bg-white shadow-xl rounded-2xl">
              {/* Badges */}
              <div className="absolute z-10 flex flex-col gap-2 top-7 left-7">
                {discount > 0 && (
                  <div className="px-2.5 py-1 text-xs font-bold text-white shadow-lg bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                    -{discount}% OFF
                  </div>
                )}
                {product.isFeatured && (
                  <div className="px-2.5 py-1 text-xs font-bold text-gray-900 shadow-lg bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg">
                    Featured
                  </div>
                )}
              </div>

              {/* Main Image with Navigation */}
              <div
                className="relative mb-4 overflow-hidden bg-gray-100 rounded-xl group"
                style={{ aspectRatio: "4/3" }}
              >
                <img
                  src={
                    product.images?.[selectedImage]?.url ||
                    "https://via.placeholder.com/600"
                  }
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />

                {/* Navigation Arrows */}
                {product.images?.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute p-1.5 transition-all transform -translate-y-1/2 bg-white/90 rounded-full shadow-lg left-3 top-1/2 hover:scale-110 hover:bg-white"
                    >
                      <FaChevronLeft className="text-gray-700" size={14} />
                    </button>

                    <button
                      onClick={handleNextImage}
                      className="absolute p-1.5 transition-all transform -translate-y-1/2 bg-white/90 rounded-full shadow-lg right-3 top-1/2 hover:scale-110 hover:bg-white"
                    >
                      <FaChevronRight className="text-gray-700" size={14} />
                    </button>

                    <div className="absolute px-2.5 py-1 text-xs font-semibold text-white bg-black rounded-full bottom-3 right-3 bg-opacity-70">
                      {selectedImage + 1} / {product.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                        selectedImage === idx
                          ? "ring-3 ring-primary-500 scale-105 shadow-md"
                          : "ring-2 ring-gray-200 hover:ring-primary-300 hover:scale-105"
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
          </div>

          {/* Product Details - Second on mobile, Right on desktop */}
          <div className="space-y-5 lg:col-span-7">
            {/* Product Name with Weight */}
            <div>
              <h1 className="mb-2 text-2xl font-bold leading-tight text-gray-900 lg:text-3xl">
                {getProductTitle()}
              </h1>
              {product.sku && (
                <p className="font-mono text-xs text-gray-500">
                  SKU: {product.sku}
                </p>
              )}
            </div>

            {/* Price Section - NEW DESIGN */}
            <div className="overflow-hidden bg-white border-2 shadow-lg rounded-2xl border-primary-100">
              <div className="p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Price
                    </p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-primary-600 lg:text-4xl">
                        {formatPrice(product.price)}
                      </span>
                      {product.comparePrice && (
                        <span className="text-lg text-gray-400 line-through">
                          {formatPrice(product.comparePrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  {discount > 0 && (
                    <div className="px-4 py-2 text-white shadow-lg bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
                      <p className="text-xs font-semibold">You Save</p>
                      <p className="text-xl font-bold">{discount}%</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-5 py-2 text-xs font-medium text-center bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700">
                {discount > 0 && (
                  <span>
                    Save {formatPrice(product.comparePrice - product.price)} on
                    this purchase
                  </span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="p-3 bg-white border-2 border-gray-100 shadow-sm rounded-xl">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-600">
                    In Stock
                  </span>
                  {product.stock <= 10 && (
                    <span className="px-2 py-1 ml-auto text-xs font-bold text-orange-700 bg-orange-100 rounded-lg">
                      Only {product.stock} left!
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-red-600">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="p-3 text-sm leading-relaxed text-gray-600 border-l-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-primary-500">
                {product.shortDescription}
              </p>
            )}

            {/* Quantity & Actions */}
            <div className="p-4 space-y-3 bg-white shadow-lg rounded-2xl">
              <label className="block text-xs font-bold text-gray-900 uppercase">
                Quantity
              </label>

              {/* Mobile Layout - Stacked */}
              <div className="flex flex-col gap-3 sm:hidden">
                {/* Quantity Selector */}
                <div className="flex items-center justify-center bg-gray-100 border-2 border-gray-200 rounded-xl">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-3 transition-all hover:bg-gray-200 rounded-l-xl disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <FaMinus className="text-gray-700" size={14} />
                  </button>
                  <span className="px-6 py-3 text-lg font-bold text-gray-900 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-3 transition-all hover:bg-gray-200 rounded-r-xl disabled:opacity-50"
                    disabled={quantity >= product.stock}
                  >
                    <FaPlus className="text-gray-700" size={14} />
                  </button>
                </div>

                {/* Action Buttons Row */}
                <div className="flex gap-2">
                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex items-center justify-center flex-1 gap-2 px-4 py-3 text-sm font-bold text-white transition-all bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaShoppingCart size={16} />
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-3 rounded-xl transition-all hover:scale-110 ${
                      inWishlist
                        ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {inWishlist ? (
                      <FaHeart size={20} />
                    ) : (
                      <FaRegHeart size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Desktop Layout - Side by side */}
              <div className="items-center hidden gap-2 sm:flex">
                {/* Quantity Selector */}
                <div className="flex items-center bg-gray-100 border-2 border-gray-200 rounded-xl">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 transition-all hover:bg-gray-200 rounded-l-xl disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <FaMinus className="text-gray-700" size={12} />
                  </button>
                  <span className="px-4 py-2 text-base font-bold text-gray-900 min-w-[45px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 transition-all hover:bg-gray-200 rounded-r-xl disabled:opacity-50"
                    disabled={quantity >= product.stock}
                  >
                    <FaPlus className="text-gray-700" size={12} />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex items-center justify-center flex-1 gap-2 px-5 py-2.5 text-sm font-bold text-white transition-all bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaShoppingCart size={16} />
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  className={`p-2.5 rounded-xl transition-all hover:scale-110 ${
                    inWishlist
                      ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {inWishlist ? (
                    <FaHeart size={18} />
                  ) : (
                    <FaRegHeart size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Category Badge */}
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <span className="px-3 py-1 text-xs font-semibold border-2 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 rounded-xl border-primary-200">
                  {product.category.name}
                </span>
              )}
              {product.subcategory && (
                <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-xl">
                  {product.subcategory.name}
                </span>
              )}
            </div>

            {/* Features Icons */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <FaTruck className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <p className="text-xs font-semibold text-blue-900">
                  Free Shipping
                </p>
              </div>
              <div className="p-3 text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <FaShieldAlt className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <p className="text-xs font-semibold text-green-900">
                  Secure Payment
                </p>
              </div>
              <div className="p-3 text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <FaUndo className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                <p className="text-xs font-semibold text-purple-900">
                  Easy Returns
                </p>
              </div>
            </div>

            {/* Additional Info Pills */}
            {product.brand && (
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white border-2 border-gray-100 shadow-sm rounded-xl">
                  <FaTag className="text-primary-600" size={12} />
                  <span className="font-medium text-gray-700">
                    Brand: {product.brand}
                  </span>
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-medium text-gray-700 transition-transform cursor-pointer bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl hover:scale-105"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabbed Content Section */}
        <div className="p-6 mb-8 bg-white shadow-xl rounded-2xl">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 pb-4 mb-6 border-b-2 border-gray-100">
            {["description", "features", "ingredients", "howToUse"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm rounded-xl font-semibold transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab === "description" && "Description"}
                  {tab === "features" && "Features"}
                  {tab === "ingredients" && "Ingredients"}
                  {tab === "howToUse" && "How to Use"}
                </button>
              )
            )}
          </div>

          {/* Tab Content */}
          <div className="prose max-w-none">
            {activeTab === "description" && (
              <div className="text-sm leading-relaxed text-gray-700">
                {product.description}
              </div>
            )}

            {activeTab === "features" && product.features?.length > 0 && (
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 p-2.5 bg-gradient-to-r from-green-50 to-white rounded-lg"
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-5 h-5 mt-0.5 bg-green-500 rounded-full">
                      <FaCheck className="text-xs text-white" />
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "ingredients" && product.ingredients && (
              <div className="p-4 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white rounded-xl">
                <p className="text-sm leading-relaxed text-gray-700">
                  {product.ingredients}
                </p>
              </div>
            )}

            {activeTab === "howToUse" && product.howToUse && (
              <div className="p-4 border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-white rounded-xl">
                <p className="text-sm leading-relaxed text-gray-700">
                  {product.howToUse}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-6 bg-white shadow-xl rounded-2xl">
          <h2 className="flex items-center gap-3 mb-6 text-xl font-bold">
            <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-primary-500 to-primary-700"></span>
            Customer Reviews
          </h2>
          <ProductReviews productId={product._id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
