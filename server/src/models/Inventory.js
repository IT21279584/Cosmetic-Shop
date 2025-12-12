const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    reorderQuantity: {
      type: Number,
      default: 50,
    },
    lastRestocked: {
      type: Date,
    },
    stockHistory: [
      {
        quantity: Number,
        type: {
          type: String,
          enum: ["in", "out", "adjustment"],
          required: true,
        },
        reason: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Check if stock is low
inventorySchema.methods.isLowStock = function () {
  return this.quantity <= this.lowStockThreshold;
};

module.exports = mongoose.model("Inventory", inventorySchema);