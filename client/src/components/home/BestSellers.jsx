// BestSellers.jsx Component
import React from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../products/ProductGrid";

const BestSellers = ({ products = [], loading = false }) => {
  return (
    <section className="py-16 bg-gray-50 -mx-4 px-4 lg:-mx-0 lg:px-0 rounded-2xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Best Sellers
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our customers' favorite picks that keep flying off the shelves
        </p>
      </div>

      {loading ? (
        <ProductGrid products={[]} loading={true} />
      ) : products && products.length > 0 ? (
        <ProductGrid products={products} loading={false} />
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌟</div>
          <p className="text-gray-600 text-lg">
            No best sellers available at the moment.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Check back soon for our top products!
          </p>
        </div>
      )}

      <div className="text-center mt-8">
        <Link to="/shop" className="btn-primary inline-block px-6 py-3">
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default BestSellers;
