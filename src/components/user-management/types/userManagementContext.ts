
import { User } from '@/types/user';
import { UserFormData } from './formData';
import { ConfirmDialogState, UserCreationDialogState, UserEditDialogState } from './dialogStates';

/**
 * Interface for the user management context
 */
export interface UserManagementContextType extends ConfirmDialogState, UserCreationDialogState {
  users: User[];
  loading: boolean;
  openEditUser: string | null;
  editUserData: Partial<UserFormData>;
  supervisors: User[];
  students: User[];
  setOpenNewUser: (open: boolean) => void;
  setNewUser: (user: Partial<UserFormData>) => void;
  handleCreateUser: () => Promise<void>;
  handleEditUser: (userId: string) => void;
  handleUpdateUser: () => Promise<void>;
  handleAssignSupervisor: (studentId: string, supervisorId: string) => Promise<void>;
  handleDeleteUser: (userId: string) => Promise<void>;
  setShowConfirmDialog: (show: boolean) => void;
}
