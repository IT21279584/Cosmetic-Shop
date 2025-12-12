import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaShoppingBag,
  FaHeart,
  FaUsers,
  FaAward,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Hero = () => {
  const targetStats = { products: 500, customers: 50000, rating: 4.9 };

  const [animatedStats, setAnimatedStats] = useState({
    products: 0,
    customers: 0,
    rating: 0,
  });

  useEffect(() => {
    const duration = 2500;
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        products: Math.floor(targetStats.products * easedProgress),
        customers: Math.floor(targetStats.customers * easedProgress),
        rating: parseFloat((targetStats.rating * easedProgress).toFixed(1)),
      });

      if (frame >= totalFrames) {
        clearInterval(counter);
        setAnimatedStats(targetStats);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + "k";
    }
    return num.toString();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      {/* Animated Background Blobs */}
      <div className="absolute rounded-full top-20 -right-20 w-96 h-96 bg-gradient-to-br from-red-400/30 to-rose-400/30 blur-3xl animate-pulse" />
      <div className="absolute rounded-full -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-orange-400/30 blur-3xl animate-pulse" />

      <div className="container relative z-10 px-4 pt-8 pb-20 mx-auto lg:pt-12 lg:pb-32">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <div>
            <div className="inline-block px-4 py-2 mb-6 border rounded-full bg-white/40 backdrop-blur-md border-white/60">
              <span className="text-sm font-medium text-transparent bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text">
                ✨ New Collection 2024
              </span>
            </div>

            <h1 className="mb-6 text-6xl font-bold leading-tight text-gray-900 lg:text-7xl">
              Glow with
              <span className="block text-transparent bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 bg-clip-text">
                Confidence
              </span>
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-gray-700">
              Unlock your radiant beauty with our luxurious, cruelty-free
              cosmetics. Made with love, designed for you.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button className="relative px-8 py-4 overflow-hidden font-semibold text-white transition-transform rounded-full bg-gradient-to-r from-red-500 to-rose-500 hover:scale-105">
                <Link to="/shop">
                  <span className="relative z-10 flex items-center gap-2">
                    <FaShoppingBag />
                    Explore Collection
                  </span>
                </Link>
              </button>

              <button className="px-8 py-4 font-semibold text-gray-900 transition-all border-2 border-red-200 rounded-full bg-white/60 backdrop-blur-md hover:bg-white/80 hover:scale-105">
                <Link to="/about">About Us</Link>
              </button>
            </div>

            {/* Stats with Auto Increment */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: FaShoppingBag,
                  value: animatedStats.products,
                  suffix: "+",
                  label: "Products",
                },
                {
                  icon: FaUsers,
                  value: animatedStats.customers,
                  format: true,
                  suffix: "+",
                  label: "Happy Customers",
                },
                {
                  icon: FaStar,
                  value: animatedStats.rating,
                  label: "Rating",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="relative transition-transform group hover:-translate-y-1"
                >
                  <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-br from-red-400 to-rose-400 rounded-2xl blur-xl group-hover:opacity-30" />
                  <div className="relative p-4 text-center border bg-white/50 backdrop-blur-xl border-white/60 rounded-2xl">
                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-red-600" />
                    <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text">
                      {stat.format ? formatNumber(stat.value) : stat.value}
                      {stat.suffix || ""}
                    </div>
                    <div className="text-xs font-medium text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 overflow-hidden shadow-2xl rounded-3xl hover:scale-[1.02] transition-transform">
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800"
                alt="Beauty Products"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 via-transparent to-transparent" />

              {/* Floating Elements */}
              <div className="absolute p-4 shadow-xl top-10 right-10 bg-white/90 backdrop-blur-md rounded-2xl animate-bounce">
                <div className="flex items-center gap-2">
                  <FaHeart className="text-red-500" />
                  <div>
                    <div className="text-xs text-gray-600">Favorites</div>
                    <div className="text-lg font-bold text-gray-900">1.2k+</div>
                  </div>
                </div>
              </div>

              <div className="absolute p-4 shadow-xl bottom-10 left-10 bg-white/90 backdrop-blur-md rounded-2xl">
                <div className="flex items-center gap-2">
                  <FaAward className="text-yellow-500" />
                  <div>
                    <div className="text-xs text-gray-600">Award Winner</div>
                    <div className="text-sm font-bold text-gray-900">2024</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute w-40 h-40 rounded-full -top-10 -right-10 bg-gradient-to-br from-yellow-400 to-orange-400 blur-2xl opacity-40 animate-pulse" />
            <div className="absolute w-40 h-40 rounded-full -bottom-10 -left-10 bg-gradient-to-br from-red-400 to-rose-400 blur-2xl opacity-40 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute transform -translate-x-1/2 bottom-10 left-1/2 animate-bounce">
        <div className="flex items-start justify-center w-6 h-10 p-2 border-2 border-gray-400 rounded-full">
          <div className="w-1.5 h-2 bg-gray-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
