
import { authService as modulesAuthService } from './auth';
export type { AuthResponse } from './auth/types';

// Export the auth service from our modules
export const authService = modulesAuthService;
