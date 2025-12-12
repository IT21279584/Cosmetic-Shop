export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters",
    };
  }
  return { isValid: true };
};

export const validatePhone = (phone) => {
  const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return re.test(phone);
};

export const validateZipCode = (zipCode) => {
  const re = /^\d{5}(-\d{4})?$/;
  return re.test(zipCode);
};

export const validateRequired = (value, fieldName = "This field") => {
  if (!value || value.toString().trim() === "") {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true };
};

export const validateMinLength = (
  value,
  minLength,
  fieldName = "This field"
) => {
  if (value.length < minLength) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${minLength} characters`,
    };
  }
  return { isValid: true };
};

export const validateMaxLength = (
  value,
  maxLength,
  fieldName = "This field"
) => {
  if (value.length > maxLength) {
    return {
      isValid: false,
      message: `${fieldName} must be no more than ${maxLength} characters`,
    };
  }
  return { isValid: true };
};

export const validateNumber = (value, fieldName = "This field") => {
  if (isNaN(value)) {
    return { isValid: false, message: `${fieldName} must be a number` };
  }
  return { isValid: true };
};

export const validatePositiveNumber = (value, fieldName = "This field") => {
  const numValue = parseFloat(value);
  if (isNaN(numValue) || numValue <= 0) {
    return {
      isValid: false,
      message: `${fieldName} must be a positive number`,
    };
  }
  return { isValid: true };
};
