/**
 * Format price to 2 decimal places
 * @param {number} price
 * @returns {string}
 */
const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

/**
 * Generate random string
 * @param {number} length
 * @returns {string}
 */
const generateRandomString = (length = 8) => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice
 * @param {number} discountedPrice
 * @returns {number}
 */
const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Paginate results
 * @param {number} page
 * @param {number} limit
 * @returns {Object}
 */
const getPagination = (page = 1, limit = 10) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip,
  };
};

/**
 * Format phone number
 * @param {string} phone
 * @returns {string}
 */
const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Calculate tax
 * @param {number} amount
 * @param {number} taxRate - Tax rate as percentage (e.g., 8.5 for 8.5%)
 * @returns {number}
 */
const calculateTax = (amount, taxRate = 8.5) => {
  return parseFloat((amount * (taxRate / 100)).toFixed(2));
};

/**
 * Calculate shipping cost based on weight and location
 * @param {number} weight - Weight in kg
 * @param {string} country
 * @returns {number}
 */
const calculateShipping = (weight, country = "USA") => {
  // Simple shipping calculation - customize as needed
  const baseRate = country === "USA" ? 5.99 : 15.99;
  const perKgRate = country === "USA" ? 2.5 : 5.0;

  return parseFloat((baseRate + weight * perKgRate).toFixed(2));
};

/**
 * Generate SKU
 * @param {string} category
 * @param {string} productName
 * @returns {string}
 */
const generateSKU = (category, productName) => {
  const categoryCode = category.substring(0, 4).toUpperCase();
  const productCode = productName
    .substring(0, 3)
    .toUpperCase()
    .replace(/\s/g, "");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `${categoryCode}-${productCode}-${random}`;
};

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize filename for uploads
 * @param {string} filename
 * @returns {string}
 */
const sanitizeFilename = (filename) => {
  return filename
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_.]/g, "");
};

/**
 * Create slug from string
 * @param {string} text
 * @returns {string}
 */
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

/**
 * Get date range for queries
 * @param {string} range - 'today', 'week', 'month', 'year'
 * @returns {Object}
 */
const getDateRange = (range) => {
  const now = new Date();
  let startDate;

  switch (range) {
    case "today":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "week":
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "month":
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case "year":
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(0);
  }

  return {
    startDate,
    endDate: new Date(),
  };
};

module.exports = {
  formatPrice,
  generateRandomString,
  calculateDiscountPercentage,
  getPagination,
  formatPhoneNumber,
  calculateTax,
  calculateShipping,
  generateSKU,
  isValidEmail,
  sanitizeFilename,
  createSlug,
  getDateRange,
};
