import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShippingForm from "./ShippingForm";
import PaymentForm from "./PaymentForm";
import OrderSummary from "./OrderSummary";
import CheckoutSteps from "./CheckoutSteps";
import useCart from "../../hooks/useCart";
import orderService from "../../services/orderService";
import { calculateTax, calculateShipping } from "../../utils/helpers";
import { toast } from "react-toastify";

const CheckoutForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleShippingSubmit = (data) => {
    setShippingInfo(data);
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (paymentData) => {
    setLoading(true);
    try {
      const subtotal = cart.totalPrice;
      const tax = calculateTax(subtotal);
      const shipping = calculateShipping(subtotal);
      const total = subtotal + tax + shipping;

      const orderData = {
        orderItems: cart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          image: item.product.images[0]?.url,
          price: item.price,
        })),
        shippingAddress: shippingInfo,
        paymentMethod: "card",
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      };

      const response = await orderService.createOrder(orderData);
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-success/${response.data._id}`);
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <CheckoutSteps currentStep={currentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <ShippingForm onSubmit={handleShippingSubmit} />
          )}
          {currentStep === 2 && (
            <PaymentForm onSubmit={handlePaymentSubmit} loading={loading} />
          )}
        </div>

        <div className="lg:col-span-1">
          <OrderSummary cart={cart} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
