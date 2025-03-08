
export const createValidators = () => {
  // Validation states
  let emailError = '';
  let passwordError = '';
  let confirmPasswordError = '';

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    emailError = isValid ? '' : 'Մուտքագրեք վավեր էլ․ հասցե';
    return isValid;
  };

  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters and contain uppercase, lowercase and numbers
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const isValid = passwordRegex.test(password);
    passwordError = isValid ? '' : 'Գաղտնաբառը պետք է պարունակի առնվազն 8 նիշ, մեծատառ, փոքրատառ և թվանշան';
    return isValid;
  };

  const validateConfirmPassword = (confirmPass: string, password: string): boolean => {
    const isValid = confirmPass === password;
    confirmPasswordError = isValid ? '' : 'Գաղտնաբառերը չեն համընկնում';
    return isValid;
  };

  return {
    emailError,
    passwordError, 
    confirmPasswordError,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    setEmailError: (error: string) => { emailError = error; },
    setPasswordError: (error: string) => { passwordError = error; },
    setConfirmPasswordError: (error: string) => { confirmPasswordError = error; }
  };
};

export default createValidators;
