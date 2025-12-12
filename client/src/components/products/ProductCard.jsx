import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaShoppingCart,
  FaEye,
} from "react-icons/fa";
import { formatPrice, calculateDiscount } from "../../utils/helpers";
import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";
import QuickView from "./QuickView";
const ProductCard = ({ product }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    setShowQuickView(true);
  };

  const discount = product.comparePrice
    ? calculateDiscount(product.comparePrice, product.price)
    : 0;

  return (
    <>
      <Link
        to={`/product/${product.slug || product._id}`}
        className="block p-4 product-card group"
      >
        {/* Image Container */}
        <div className="relative mb-4 overflow-hidden bg-gray-100 rounded-xl aspect-square">
          <img
            src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />

          {/* Badges */}
          {discount > 0 && (
            <div className="absolute px-2 py-1 text-xs font-bold text-white bg-red-500 rounded top-3 left-3">
              -{discount}%
            </div>
          )}

          {product.isFeatured && (
            <div className="absolute px-2 py-1 text-xs font-bold text-white rounded top-3 right-3 bg-gold-500">
              Featured
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute inset-0 flex items-center justify-center space-x-2 transition-all duration-300 bg-black bg-opacity-0 opacity-0 group-hover:bg-opacity-20 group-hover:opacity-100">
            <button
              onClick={handleQuickView}
              className="p-3 transition-colors bg-white rounded-full hover:bg-primary-600 hover:text-white"
              title="Quick View"
            >
              <FaEye />
            </button>
            <button
              onClick={handleWishlistToggle}
              className="p-3 transition-colors bg-white rounded-full hover:bg-primary-600 hover:text-white"
              title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {inWishlist ? (
                <FaHeart className="text-primary-600" />
              ) : (
                <FaRegHeart />
              )}
            </button>
            <button
              onClick={handleAddToCart}
              className="p-3 transition-colors bg-white rounded-full hover:bg-primary-600 hover:text-white"
              title="Add to Cart"
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 transition-colors group-hover:text-primary-600 line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={14}
                  className={
                    i < Math.round(product.rating)
                      ? "text-gold-500"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.numReviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock <= 0 && (
            <p className="text-sm font-medium text-red-500">Out of Stock</p>
          )}
          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-sm font-medium text-orange-500">
              Only {product.stock} left!
            </p>
          )}
        </div>
      </Link>

      {/* Quick View Modal */}
      <QuickView
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
};

export default ProductCard;
