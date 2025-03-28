
import { UserRole } from '@/types/user';

/**
 * Interface for user form data
 */
export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  course?: string;
  group?: string;
  avatar?: string;
  organization?: string;
  bio?: string;
}

/**
 * Interface for user form validation errors
 */
export interface UserFormValidationErrors {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  course?: string;
  group?: string;
}
