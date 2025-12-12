import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import cartService from "../services/cartService";
import { toast } from "react-toastify";
import { calculateCartTotal } from "../utils/helpers";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  // Load cart on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Load from localStorage for guests
      const localCart = cartService.getLocalCart();
      setCart(localCart);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      if (isAuthenticated) {
        const data = await cartService.addToCart(product._id, quantity);
        setCart(data.data);
        toast.success("Added to cart!");
      } else {
        // Handle guest cart
        const localCart = cartService.getLocalCart();
        const existingItemIndex = localCart.items.findIndex(
          (item) => item.product._id === product._id
        );

        if (existingItemIndex > -1) {
          localCart.items[existingItemIndex].quantity += quantity;
        } else {
          localCart.items.push({
            product,
            quantity,
            price: product.price,
          });
        }

        localCart.totalPrice = calculateCartTotal(localCart.items);
        cartService.saveLocalCart(localCart);
        setCart(localCart);
        toast.success("Added to cart!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (isAuthenticated) {
        const data = await cartService.updateCartItem(itemId, quantity);
        setCart(data.data);
      } else {
        const localCart = cartService.getLocalCart();
        const item = localCart.items.find((item) => item._id === itemId);
        if (item) {
          item.quantity = quantity;
          localCart.totalPrice = calculateCartTotal(localCart.items);
          cartService.saveLocalCart(localCart);
          setCart(localCart);
        }
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (isAuthenticated) {
        const data = await cartService.removeFromCart(itemId);
        setCart(data.data);
        toast.success("Item removed from cart");
      } else {
        const localCart = cartService.getLocalCart();
        localCart.items = localCart.items.filter((item) => item._id !== itemId);
        localCart.totalPrice = calculateCartTotal(localCart.items);
        cartService.saveLocalCart(localCart);
        setCart(localCart);
        toast.success("Item removed from cart");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartService.clearCart();
      }
      setCart({ items: [], totalPrice: 0 });
      cartService.saveLocalCart({ items: [], totalPrice: 0 });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getCartItemsCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
    cartItemsCount: getCartItemsCount(),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
