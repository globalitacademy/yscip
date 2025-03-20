
import { login, loginAdmin } from './loginService';
import { register } from './registrationService';
import { logout, getCurrentUser } from './sessionService';
import { AuthResponse } from './types';

export const authService = {
  login,
  loginAdmin,
  register,
  logout,
  getCurrentUser
};

export type { AuthResponse };
