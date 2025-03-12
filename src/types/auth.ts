
import { User, UserRole } from '@/data/userRoles';

export interface PendingUser extends Partial<User> {
  verificationToken: string;
  verified: boolean;
  password: string;
  registrationApproved?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  registerUser: (userData: Partial<User> & { password: string }) => Promise<{success: boolean, token?: string}>;
  sendVerificationEmail: (email: string) => Promise<{success: boolean, token?: string}>;
  verifyEmail: (token: string) => Promise<boolean>;
  approveRegistration: (userId: string) => Promise<boolean>;
  getPendingUsers: () => PendingUser[];
  resetAdminAccount: () => Promise<boolean>;
}
