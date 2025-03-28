
import { useUsersFetching } from './hooks/useUsersFetching';
import { useConfirmDialog } from './hooks/useConfirmDialog';
import { useUserCreation } from './hooks/useUserCreation';
import { useUserEditing } from './hooks/useUserEditing';
import { useUserDeletion } from './hooks/useUserDeletion';
import { useSupervisorAssignment } from './hooks/useSupervisorAssignment';

export const useUserManagement = () => {
  // Get users data
  const { users, setUsers, loading } = useUsersFetching();
  
  // Get confirmation dialog functionality
  const { 
    showConfirmDialog, 
    confirmTitle, 
    confirmDescription, 
    confirmAction, 
    isConfirming, 
    setShowConfirmDialog, 
    setIsConfirming, 
    showConfirm 
  } = useConfirmDialog();
  
  // Get user creation functionality
  const { 
    openNewUser, 
    newUser, 
    setOpenNewUser, 
    setNewUser, 
    handleCreateUser 
  } = useUserCreation(users, setUsers, showConfirm, setIsConfirming);
  
  // Get user editing functionality
  const { 
    openEditUser, 
    editUserData, 
    setEditUserData, 
    handleEditUser, 
    handleUpdateUser 
  } = useUserEditing(users, setUsers, showConfirm, setIsConfirming);
  
  // Get user deletion functionality
  const { handleDeleteUser } = useUserDeletion(users, setUsers, showConfirm, setIsConfirming);
  
  // Get supervisor assignment functionality
  const { handleAssignSupervisor } = useSupervisorAssignment(users, setUsers, showConfirm, setIsConfirming);

  // Filter supervisors and students
  const supervisors = users.filter(user => 
    user.role === 'supervisor' || user.role === 'project_manager'
  );
  
  const students = users.filter(user => user.role === 'student');
  
  return {
    users,
    loading,
    openNewUser,
    openEditUser,
    newUser: editUserData && openEditUser ? editUserData : newUser,
    supervisors,
    students,
    showConfirmDialog,
    confirmTitle,
    confirmDescription,
    confirmAction,
    isConfirming,
    setOpenNewUser,
    setNewUser: openEditUser ? setEditUserData : setNewUser,
    handleCreateUser,
    handleEditUser,
    handleUpdateUser,
    handleAssignSupervisor,
    handleDeleteUser,
    setShowConfirmDialog
  };
};
