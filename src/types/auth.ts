
import { User, UserRole } from '@/data/userRoles';

// Supabase admin user type
export interface SupabaseAdminUser {
  id: string;
  email?: string | null;
  email_confirmed_at?: string | null;
  created_at?: string;
  user_metadata?: {
    name?: string;
    role?: UserRole | 'superadmin'; // Ավելացվել է superadmin դերը
    registration_approved?: boolean;
    organization?: string;
    department?: string;
    avatar?: string;
  };
}

// Auth context interface
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (userData: Partial<User>) => Promise<{success: boolean, message?: string}>;
  verifyEmail: (token: string) => Promise<boolean>;
  approveRegistration: (userId: string) => Promise<boolean>;
  getPendingUsers: () => Promise<any[]>;
}
