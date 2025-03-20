
import { User } from '@/types/user';

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}
