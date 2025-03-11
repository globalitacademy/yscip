
import { UserRole } from './database.types';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  course?: string;
  group?: string;
  organization?: string;
  specialization?: string;
  registrationApproved?: boolean;
}
