
import { User, UserRole } from '@/data/userRoles';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (userData: Partial<User>) => Promise<{success: boolean, token?: string}>;
  sendVerificationEmail: (email: string) => Promise<{success: boolean, token?: string}>;
  verifyEmail: (token: string) => Promise<boolean>;
  approveRegistration: (userId: string) => Promise<boolean>;
  getPendingUsers: () => any[];
  syncRolesWithDatabase: () => Promise<boolean>;
  resetRolesAndSettings: () => Promise<boolean>;
}

export interface PendingUser extends Partial<User> {
  verificationToken: string;
  verified: boolean;
  password?: string; // Store password for real login after verification
}

export interface DatabaseSyncStatus {
  lastSynced: number;
  isSuccessful: boolean;
  errorMessage?: string;
}
