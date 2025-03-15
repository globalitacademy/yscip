
import { User, UserRole } from '@/types/user';

export interface PendingUser extends Partial<User> {
  verificationToken: string;
  verified: boolean;
  password: string;
  registrationApproved?: boolean;
}

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  registerUser: (userData: Partial<User> & { password: string }) => Promise<{success: boolean, token?: string}>;
  sendVerificationEmail: (email: string) => Promise<{success: boolean, token?: string}>;
  verifyEmail: (token: string) => Promise<boolean>;
  approveRegistration: (userId: string) => Promise<boolean>;
  getPendingUsers: () => PendingUser[];
  resetAdminAccount: () => Promise<boolean>;
  demoAccounts?: DemoAccount[];
  manageDemoAccount: (account: DemoAccount, action: 'add' | 'update' | 'delete') => Promise<boolean>;
  registerRealAccount: (userData: Partial<User> & { password: string }) => Promise<{success: boolean, user?: User}>;
}
