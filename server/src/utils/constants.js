const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const PAYMENT_METHODS = {
  STRIPE: "stripe",
  PAYPAL: "paypal",
  CARD: "card",
};

const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

const PRODUCT_SORT_OPTIONS = {
  PRICE_ASC: "price_asc",
  PRICE_DESC: "price_desc",
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
  RATING: "rating",
  NEWEST: "newest",
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

const IMAGE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  MAX_IMAGES_PER_PRODUCT: 4,
};

const EMAIL_SUBJECTS = {
  WELCOME: "Welcome to Our Cosmetic Shop! 🌸",
  ORDER_CONFIRMATION: "Order Confirmation",
  ORDER_SHIPPED: "Your Order Has Been Shipped",
  ORDER_DELIVERED: "Your Order Has Been Delivered",
  PASSWORD_RESET: "Password Reset Request",
};

const TAX_RATE = 8.5; // 8.5% tax rate

const FREE_SHIPPING_THRESHOLD = 50; // Free shipping over $50

const LOW_STOCK_THRESHOLD = 10;

module.exports = {
  ORDER_STATUS,
  PAYMENT_METHODS,
  USER_ROLES,
  PRODUCT_SORT_OPTIONS,
  PAGINATION,
  IMAGE_UPLOAD,
  EMAIL_SUBJECTS,
  TAX_RATE,
  FREE_SHIPPING_THRESHOLD,
  LOW_STOCK_THRESHOLD,
};
