const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");
const { protect } = require("../middleware/authMiddleware");
const { paymentLimiter } = require("../middleware/rateLimiter");
const Order = require("../models/Order");

// Create payment intent
router.post(
  "/create-payment-intent",
  protect,
  paymentLimiter,
  async (req, res, next) => {
    try {
      const { amount } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          userId: req.user.id,
        },
      });

      res.status(200).json({
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Webhook to handle payment confirmation
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      // Update order payment status
      // You'll need to store orderId in paymentIntent metadata when creating it
      if (paymentIntent.metadata.orderId) {
        await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, {
          isPaid: true,
          paidAt: Date.now(),
          paymentResult: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            updateTime: paymentIntent.created,
          },
        });
      }
    }

    res.json({ received: true });
  }
);
module.exports = router;
