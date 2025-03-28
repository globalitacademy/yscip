
import { User } from '@/types/user';

/**
 * Interface for the confirmation dialog state
 */
export interface ConfirmDialogState {
  showConfirmDialog: boolean;
  confirmTitle: string;
  confirmDescription: string;
  confirmAction: () => Promise<void>;
  isConfirming: boolean;
}

/**
 * Interface for the user creation dialog state
 */
export interface UserCreationDialogState {
  openNewUser: boolean;
  newUser: Partial<User>;
}

/**
 * Interface for the user editing dialog state
 */
export interface UserEditDialogState {
  openEditUser: string | null;
  editUserData: Partial<User>;
}
