import React from "react";
import {
  formatPrice,
  calculateTax,
  calculateShipping,
} from "../../utils/helpers";

const OrderSummary = ({ cart }) => {
  const subtotal = cart.totalPrice;
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
      <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

      <div className="space-y-3 mb-6">
        {cart.items.map((item) => (
          <div key={item._id} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.product.name} x {item.quantity}
            </span>
            <span className="font-medium">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="border-t pt-3 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary-600">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
