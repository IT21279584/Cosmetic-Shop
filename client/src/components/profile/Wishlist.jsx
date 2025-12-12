import React from "react";
import useWishlist from "../../hooks/useWishlist";
import ProductCard from "../products/ProductCard";
import Loader from "../common/Loader";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, loading } = useWishlist();

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

      {wishlist.products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💝</div>
          <p className="text-gray-600 mb-4">Your wishlist is empty</p>
          <Link to="/shop" className="btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
