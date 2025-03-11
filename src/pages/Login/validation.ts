
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
