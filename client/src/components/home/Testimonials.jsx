import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaUsers, FaAward, FaLeaf } from "react-icons/fa";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Beauty Enthusiast",
      image: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      text: "These products transformed my skincare routine completely! The natural ingredients make such a difference, and my skin has never felt healthier.",
      gradient: "from-red-400 to-rose-400",
    },
    {
      id: 2,
      name: "Emily Davis",
      role: "Makeup Artist",
      image: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      text: "As a professional, I'm incredibly picky about products. This shop exceeded all my expectations with quality and performance.",
      gradient: "from-rose-400 to-pink-400",
    },
    {
      id: 3,
      name: "Jessica Williams",
      role: "Skincare Blogger",
      image: "https://i.pravatar.cc/150?img=9",
      rating: 5,
      text: "I've recommended this shop to all my followers. The customer service is exceptional, and every product is worth the investment!",
      gradient: "from-pink-400 to-red-400",
    },
  ];

  return (
    <section className="px-4 py-8 sm:py-12 lg:py-16">
      <motion.div
        className="mb-8 text-center sm:mb-12 lg:mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4 rounded-full bg-gradient-to-r from-red-100 to-rose-100"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-xs font-semibold text-transparent sm:text-sm bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text">
            TESTIMONIALS
          </span>
        </motion.div>
        <h2 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl sm:mb-4">
          Loved by Thousands
        </h2>
        <p className="max-w-2xl mx-auto text-base text-gray-600 sm:text-lg lg:text-xl">
          Real stories from our amazing community
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, idx) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -10 }}
            className="relative group"
          >
            {/* Gradient Glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
            />

            {/* Card */}
            <div className="relative p-6 transition-all duration-500 bg-white border border-gray-100 shadow-lg sm:p-8 rounded-2xl sm:rounded-3xl hover:shadow-2xl">
              {/* Quote Icon */}
              <div
                className={`absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center shadow-lg`}
              >
                <svg
                  className="w-5 h-5 text-white sm:w-6 sm:h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 + i * 0.1 }}
                  >
                    <FaStar className="text-yellow-400" size={16} />
                  </motion.div>
                ))}
              </div>

              {/* Text */}
              <p className="mb-4 text-sm italic leading-relaxed text-gray-700 sm:text-base sm:mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 sm:gap-4 sm:pt-6">
                <div className="relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} rounded-full blur-md opacity-40`}
                  />
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="relative border-2 border-white rounded-full shadow-lg w-12 h-12 sm:w-14 sm:h-14"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 sm:text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-gray-500 sm:text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust Badges */}
      <motion.div
        className="grid grid-cols-2 gap-4 mt-8 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-6 lg:gap-8 sm:mt-12 lg:mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {[
          { icon: FaUsers, text: "50,000+ Happy Customers" },
          { icon: FaStar, text: "4.9/5 Average Rating" },
          { icon: FaAward, text: "Award Winning" },
          { icon: FaLeaf, text: "100% Natural" },
        ].map((badge, idx) => (
          <motion.div
            key={idx}
            className="flex items-center justify-center gap-2 text-gray-600 sm:justify-start"
            whileHover={{ scale: 1.1 }}
          >
            <badge.icon className="text-base text-red-600 sm:text-lg" />
            <span className="text-xs font-medium sm:text-sm lg:text-base">
              {badge.text}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Testimonials;
