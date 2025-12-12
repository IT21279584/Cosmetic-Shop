import React from "react";
import { FaLeaf, FaHeart, FaStar, FaShippingFast } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
            About Cosmetic Shop
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted destination for premium beauty and cosmetic products
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-xl shadow-soft p-8 lg:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded with a passion for natural beauty, Cosmetic Shop has
                been delivering premium skincare and cosmetic products to
                customers worldwide since 2020.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We believe that everyone deserves access to high-quality beauty
                products that are both effective and safe. That's why we
                carefully curate our collection to include only the best
                products from trusted brands.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our mission is to help you discover products that make you feel
                confident and beautiful, inside and out.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800"
                alt="About us"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-soft p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLeaf className="text-primary-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Natural Ingredients
            </h3>
            <p className="text-gray-600">
              Products made with natural, safe ingredients
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHeart className="text-primary-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Customer First
            </h3>
            <p className="text-gray-600">
              Your satisfaction is our top priority
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaStar className="text-primary-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Premium Quality
            </h3>
            <p className="text-gray-600">
              Only the best products from trusted brands
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShippingFast className="text-primary-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Fast Shipping
            </h3>
            <p className="text-gray-600">
              Quick and reliable delivery worldwide
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-primary-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-primary-100">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8</div>
              <div className="text-primary-100">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-100">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
