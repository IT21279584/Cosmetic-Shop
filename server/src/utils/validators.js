/**
 * Validation helper functions
 */

const validatePassword = (password) => {
  // At least 6 characters
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }
  return { isValid: true };
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Invalid email format" };
  }
  return { isValid: true };
};

const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: "Invalid phone number format" };
  }
  return { isValid: true };
};

const validateZipCode = (zipCode) => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zipCode)) {
    return { isValid: false, message: "Invalid zip code format" };
  }
  return { isValid: true };
};

const validatePrice = (price) => {
  if (isNaN(price) || price < 0) {
    return { isValid: false, message: "Price must be a positive number" };
  }
  return { isValid: true };
};

const validateStock = (stock) => {
  if (!Number.isInteger(stock) || stock < 0) {
    return { isValid: false, message: "Stock must be a positive integer" };
  }
  return { isValid: true };
};

const validateRating = (rating) => {
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { isValid: false, message: "Rating must be between 1 and 5" };
  }
  return { isValid: true };
};

module.exports = {
  validatePassword,
  validateEmail,
  validatePhoneNumber,
  validateZipCode,
  validatePrice,
  validateStock,
  validateRating,
};