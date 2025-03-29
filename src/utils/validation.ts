export const validateEmail = (email: string): { isValid: boolean; error: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  return {
    isValid,
    error: isValid ? '' : 'Մուտքագրեք վավեր էլ․ հասցե'
  };
};

export const validatePassword = (password: string): { isValid: boolean; error: string } => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const isValid = passwordRegex.test(password);
  return {
    isValid,
    error: isValid ? '' : 'Գաղտնաբառը պետք է պարունակի առնվազն 8 նիշ, մեծատառ, փոքրատառ և թվանշան'
  };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): { isValid: boolean; error: string } => {
  const isValid = confirmPassword === password;
  return {
    isValid,
    error: isValid ? '' : 'Գաղտնաբառերը չեն համընկնում'
  };
};

/**
 * Validates if a field has a non-empty value
 */
export const validateRequiredField = (value: any): boolean => {
  if (value === undefined || value === null) return false;
  
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  
  return true;
};

/**
 * Validates a URL string
 */
export const validateUrl = (url: string): boolean => {
  try {
    // Check if it's a data URL
    if (url.startsWith('data:')) {
      return true;
    }
    
    // Otherwise, check if it's a valid URL
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validates a slug string (for friendly URLs)
 */
export const validateSlug = (slug: string): boolean => {
  // Slug should contain only letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9\-]+$/;
  return slugRegex.test(slug);
};

/**
 * Validates a course price input
 */
export const validatePrice = (price: string): boolean => {
  // Allow numbers, commas, periods, and the Armenian currency symbol
  const priceRegex = /^[\d\s,.֏]+$/;
  return priceRegex.test(price);
};

/**
 * Validates display order (should be a non-negative number)
 */
export const validateDisplayOrder = (order: number | string): boolean => {
  const numOrder = Number(order);
  return !isNaN(numOrder) && numOrder >= 0;
};
