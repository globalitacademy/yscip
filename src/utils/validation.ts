
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
