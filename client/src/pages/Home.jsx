import React, { useEffect, useState } from "react";
import Hero from "../components/home/Hero";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Categories from "../components/home/Categories";
import BestSellers from "../components/home/BestSellers";
import Newsletter from "../components/home/Newsletter";
import Testimonials from "../components/home/Testimonials";
import productService from "../services/productService";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingBestSellers, setLoadingBestSellers] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchBestSellers();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoadingFeatured(true);
    try {
      const data = await productService.getFeaturedProducts();
      console.log("Featured Products:", data); // Debug log
      setFeaturedProducts(data.data || []);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      setFeaturedProducts([]);
    } finally {
      setLoadingFeatured(false);
    }
  };

  const fetchBestSellers = async () => {
    setLoadingBestSellers(true);
    try {
      const data = await productService.getBestSellers(8);
      console.log("Best Sellers:", data); // Debug log
      setBestSellers(data.data || []);
    } catch (error) {
      console.error("Error fetching best sellers:", error);
      setBestSellers([]);
    } finally {
      setLoadingBestSellers(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Hero />

      <div className="container mx-auto px-4 py-16 space-y-24">
        <Categories />

        <FeaturedProducts
          products={featuredProducts}
          loading={loadingFeatured}
        />

        <BestSellers products={bestSellers} loading={loadingBestSellers} />

        <Testimonials />
      </div>

      <Newsletter />
    </div>
  );
};

export default Home;
