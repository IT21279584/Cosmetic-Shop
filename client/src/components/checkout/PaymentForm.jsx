import React, { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

const PaymentForm = ({ onSubmit, loading }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(paymentData);
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <h2 className="text-xl font-semibold mb-6">Payment Information</h2>

      <form onSubmit={handleSubmit}>
        <Input
          label="Card Number"
          name="cardNumber"
          value={paymentData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          required
        />

        <Input
          label="Cardholder Name"
          name="cardName"
          value={paymentData.cardName}
          onChange={handleChange}
          placeholder="John Doe"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expiry Date"
            name="expiryDate"
            value={paymentData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            required
          />

          <Input
            label="CVV"
            name="cvv"
            value={paymentData.cvv}
            onChange={handleChange}
            placeholder="123"
            required
          />
        </div>

        <Button type="submit" fullWidth loading={loading} className="mt-6">
          Place Order
        </Button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Your payment information is secure and encrypted
        </p>
      </form>
    </div>
  );
};

export default PaymentForm;
