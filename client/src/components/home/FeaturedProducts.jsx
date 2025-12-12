import React from "react";
import ProductGrid from "../products/ProductGrid";

const FeaturedProducts = ({ products, loading }) => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Featured Products
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our handpicked selection of premium beauty products
        </p>
      </div>

      <ProductGrid products={products} loading={loading} />
    </section>
  );
};

export default FeaturedProducts;
