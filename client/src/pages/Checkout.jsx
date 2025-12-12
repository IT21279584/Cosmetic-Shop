import React from "react";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../components/checkout/CheckoutForm";
import useCart from "../hooks/useCart";

const Checkout = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

        <CheckoutForm />
      </div>
    </div>
  );
};

export default Checkout;
