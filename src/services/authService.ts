
import { authService as modulesAuthService } from './auth';
export { AuthResponse } from './auth/types';

// Export the auth service from our modules
export const authService = modulesAuthService;
