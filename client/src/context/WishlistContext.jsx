import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import userService from "../services/userService";
import { toast } from "react-toastify";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      // Load from localStorage for guests
      const localWishlist = localStorage.getItem("wishlist");
      if (localWishlist) {
        setWishlist(JSON.parse(localWishlist));
      }
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await userService.getWishlist();
      setWishlist(data.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    try {
      if (isAuthenticated) {
        const data = await userService.addToWishlist(product._id);
        setWishlist(data.data);
        toast.success("Added to wishlist!");
      } else {
        const localWishlist = JSON.parse(
          localStorage.getItem("wishlist") || '{"products":[]}'
        );
        if (!localWishlist.products.find((p) => p._id === product._id)) {
          localWishlist.products.push(product);
          localStorage.setItem("wishlist", JSON.stringify(localWishlist));
          setWishlist(localWishlist);
          toast.success("Added to wishlist!");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      if (isAuthenticated) {
        const data = await userService.removeFromWishlist(productId);
        setWishlist(data.data);
        toast.success("Removed from wishlist");
      } else {
        const localWishlist = JSON.parse(
          localStorage.getItem("wishlist") || '{"products":[]}'
        );
        localWishlist.products = localWishlist.products.filter(
          (p) => p._id !== productId
        );
        localStorage.setItem("wishlist", JSON.stringify(localWishlist));
        setWishlist(localWishlist);
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.products.some((p) => p._id === productId);
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist,
    wishlistCount: wishlist.products.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
