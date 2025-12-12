import api from "./api";

const paymentService = {
  // Create payment intent
  createPaymentIntent: async (amount) => {
    const response = await api.post("/payment/create-payment-intent", {
      amount,
    });
    return response.data;
  },
};

export default paymentService;
