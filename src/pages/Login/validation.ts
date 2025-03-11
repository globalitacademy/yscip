
import { z } from 'zod';

export const loginValidationSchema = z.object({
  email: z.string().email({ message: 'Անվավեր էլ․ հասցե' }),
  password: z.string().min(6, { message: 'Գաղտնաբառը պետք է ունենա առնվազն 6 նիշ' }),
});

export const registerValidationSchema = z.object({
  name: z.string().min(2, { message: 'Անունը պետք է ունենա առնվազն 2 նիշ' }),
  email: z.string().email({ message: 'Անվավեր էլ․ հասցե' }),
  password: z.string().min(6, { message: 'Գաղտնաբառը պետք է ունենա առնվազն 6 նիշ' }),
  confirmPassword: z.string(),
  role: z.string(),
  organization: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Գաղտնաբառերը չեն համընկնում',
  path: ['confirmPassword'],
});

// Helper validation functions for RegisterForm
export const validateEmail = (email: string) => {
  try {
    z.string().email().parse(email);
    return { isValid: true, errorMessage: '' };
  } catch (error) {
    return { isValid: false, errorMessage: 'Անվավեր էլ․ հասցե' };
  }
};

export const validatePassword = (password: string) => {
  try {
    z.string().min(6).parse(password);
    return { isValid: true, errorMessage: '' };
  } catch (error) {
    return { isValid: false, errorMessage: 'Գաղտնաբառը պետք է ունենա առնվազն 6 նիշ' };
  }
};

export const validateConfirmPassword = (confirmPassword: string, password: string) => {
  if (confirmPassword !== password) {
    return { isValid: false, errorMessage: 'Գաղտնաբառերը չեն համընկնում' };
  }
  return { isValid: true, errorMessage: '' };
};
