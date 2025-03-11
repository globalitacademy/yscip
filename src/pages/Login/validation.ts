
// Validation utility functions for login and registration forms

/**
 * Validates email format
 * @param email Email to validate
 * @returns Object containing validation result and error message
 */
export const validateEmail = (email: string): { isValid: boolean; errorMessage: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  return {
    isValid,
    errorMessage: isValid ? '' : 'Մուտքագրեք վավեր էլ․ հասցե'
  };
};

/**
 * Validates password strength
 * @param password Password to validate
 * @returns Object containing validation result and error message
 */
export const validatePassword = (password: string): { isValid: boolean; errorMessage: string } => {
  // Password must be at least 8 characters and contain uppercase, lowercase and numbers
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const isValid = passwordRegex.test(password);
  return {
    isValid,
    errorMessage: isValid ? '' : 'Գաղտնաբառը պետք է պարունակի առնվազն 8 նիշ, մեծատառ, փոքրատառ և թվանշան'
  };
};

/**
 * Validates password confirmation
 * @param confirmPassword Confirmation password
 * @param password Original password
 * @returns Object containing validation result and error message
 */
export const validateConfirmPassword = (
  confirmPassword: string,
  password: string
): { isValid: boolean; errorMessage: string } => {
  const isValid = confirmPassword === password;
  return {
    isValid,
    errorMessage: isValid ? '' : 'Գաղտնաբառերը չեն համընկնում'
  };
};
