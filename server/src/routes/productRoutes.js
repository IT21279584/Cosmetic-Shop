const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getBestSellers,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

router.get("/", getAllProducts);
router.get("/best-sellers", getBestSellers);
router.get("/:slugOrId", getProduct);
router.get("/:id/related", getRelatedProducts);

// Admin routes
router.post("/", protect, adminOnly, upload.array("images", 4), createProduct);
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 4),
  updateProduct
);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
