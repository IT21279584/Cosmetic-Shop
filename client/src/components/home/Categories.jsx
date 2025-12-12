import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Categories = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Shop by Category
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our wide range of beauty and cosmetic products
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.slice(0, 5).map((category, index) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link to={`/shop?category=${category._id}`} className="group block">
              <div className="relative overflow-hidden rounded-xl aspect-square mb-4 bg-gray-100">
                <img
                  src={
                    category.image ||
                    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400"
                  }
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-center font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                {category.name}
              </h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
