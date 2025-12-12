import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";
import { FaStar, FaUsers, FaAward, FaLeaf } from "react-icons/fa";



const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }, 1000);
  };

  return (
    <section className="px-4 py-16 my-16">
      <motion.div
        className="relative overflow-hidden rounded-3xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-rose-600 to-pink-600">
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.5) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(244, 63, 94, 0.5) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.5) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 p-8 text-white lg:p-16">
          {/* Floating Icons */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/20"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              {i % 2 === 0 ? <HiSparkles size={24} /> : <FaLeaf size={24} />}
            </motion.div>
          ))}

          <div className="relative z-20 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto border rounded-full bg-white/20 backdrop-blur-md border-white/40">
                <FaPaperPlane className="text-2xl" />
              </div>
            </motion.div>

            <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
              Join the Glow Club
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Get exclusive access to new launches, beauty secrets, and special
              offers
            </p>

            <div className="relative max-w-xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 transition-opacity bg-white rounded-full opacity-25 blur-xl group-hover:opacity-40" />
                <div className="relative flex flex-col gap-3 p-2 border rounded-full sm:flex-row bg-white/10 backdrop-blur-xl border-white/30">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    disabled={subscribed}
                    className="flex-1 px-6 py-3 text-gray-900 placeholder-gray-500 rounded-full bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || subscribed || !email}
                    className="px-8 py-3 font-semibold text-red-600 transition-colors bg-white rounded-full hover:bg-gray-100 disabled:opacity-50 whitespace-nowrap"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {subscribed
                      ? "✓ Subscribed!"
                      : loading
                      ? "Joining..."
                      : "Subscribe"}
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                No spam ever
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Unsubscribe anytime
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Newsletter;
