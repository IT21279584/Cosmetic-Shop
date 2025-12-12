const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validateRequest");
const { authLimiter } = require("../middleware/rateLimiter");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Validation rules
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", authLimiter, registerValidation, validate, register);
router.post("/login", authLimiter, loginValidation, validate, login);
router.get("/me", protect, getMe);
router.post("/forgot-password", authLimiter, forgotPassword);
router.put("/reset-password/:resetToken", authLimiter, resetPassword);
router.put("/update-password", protect, updatePassword);

module.exports = router;
