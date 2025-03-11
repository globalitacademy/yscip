
import { UserRole } from '@/types/database.types';

export interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export interface RegisterFormProps {
  onRegister: (userData: RegisterUserData) => Promise<void>;
  isLoading: boolean;
  verificationSent: boolean;
}

export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organization?: string;
}
