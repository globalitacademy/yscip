
import { useState, useCallback } from 'react';
import { User, UserRole } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUserManagementSync } from '@/hooks/useUserManagementSync';

export const useUserManagement = () => {
  const { users, loading, createUser, updateUser, deleteUser, refreshUsers } = useUserManagementSync();
  const [openNewUser, setOpenNewUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() => async () => {});
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmDescription, setConfirmDescription] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User> & { password?: string }>({
    name: '',
    email: '',
    role: 'student',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    course: '',
    group: ''
  });

  // Function to show confirmation dialog
  const showConfirm = useCallback((title: string, description: string, action: () => Promise<void>) => {
    setConfirmTitle(title);
    setConfirmDescription(description);
    setConfirmAction(() => action);
    setShowConfirmDialog(true);
  }, []);

  const handleCreateUser = useCallback(async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error("Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը");
      return;
    }

    // Generate temporary password if not provided
    const userWithPassword = {
      ...newUser,
      password: newUser.password || 'Password123!'
    };

    // Show confirmation dialog
    showConfirm(
      "Ստեղծել նոր օգտատեր",
      `Դուք պատրաստվում եք ստեղծել նոր օգտատեր անունով "${newUser.name}": Դուք հաստատո՞ւմ եք այս գործողությունը:`,
      async () => {
        setIsConfirming(true);
        try {
          const success = await createUser(userWithPassword as Partial<User> & { password: string });
          
          if (success) {
            setOpenNewUser(false);
            setNewUser({
              name: '',
              email: '',
              role: 'student',
              department: 'Ինֆորմատիկայի ֆակուլտետ',
              course: '',
              group: ''
            });
          }
        } finally {
          setIsConfirming(false);
        }
      }
    );
  }, [newUser, createUser, showConfirm]);

  const handleEditUser = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      course: user.course,
      group: user.group,
      specialization: user.specialization,
      organization: user.organization
    });
    
    setOpenEditUser(userId);
  }, [users]);
  
  const handleUpdateUser = useCallback(async () => {
    if (!openEditUser) return;

    // Show confirmation dialog
    const userToUpdate = users.find(user => user.id === openEditUser);
    if (!userToUpdate) return;

    showConfirm(
      "Թարմացնել օգտատիրոջ տվյալները",
      `Դուք պատրաստվում եք թարմացնել "${userToUpdate.name}" օգտատիրոջ տվյալները: Դուք հաստատո՞ւմ եք այս գործողությունը:`,
      async () => {
        setIsConfirming(true);
        try {
          const success = await updateUser(openEditUser, newUser);
          
          if (success) {
            setOpenEditUser(null);
            setNewUser({
              name: '',
              email: '',
              role: 'student',
              department: 'Ինֆորմատիկայի ֆակուլտետ',
              course: '',
              group: ''
            });
          }
        } finally {
          setIsConfirming(false);
        }
      }
    );
  }, [openEditUser, users, newUser, updateUser, showConfirm]);

  const handleAssignSupervisor = useCallback(async (studentId: string, supervisorId: string) => {
    // Show confirmation dialog
    const student = users.find(u => u.id === studentId);
    const supervisor = users.find(u => u.id === supervisorId);
    
    if (!student || !supervisor) return;

    showConfirm(
      "Նշանակել ղեկավար",
      `Դուք պատրաստվում եք նշանակել "${supervisor.name}"-ին որպես "${student.name}"-ի ղեկավար: Դուք հաստատո՞ւմ եք այս գործողությունը:`,
      async () => {
        setIsConfirming(true);
        try {
          // Create assignment in project_assignments table
          const { error } = await supabase
            .from('project_assignments')
            .insert({
              student_id: studentId,
              supervisor_id: supervisorId,
              status: 'assigned'
            });
            
          if (error) {
            throw error;
          }
          
          toast.success("Ուսանողին հաջողությամբ նշանակվել է ղեկավար։");
          await refreshUsers();
        } catch (error) {
          console.error('Error assigning supervisor:', error);
          toast.error("Սխալ է տեղի ունեցել ղեկավար նշանակելիս։");
        } finally {
          setIsConfirming(false);
        }
      }
    );
  }, [users, refreshUsers, showConfirm]);

  const handleDeleteUser = useCallback(async (userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    if (!userToDelete) return;

    showConfirm(
      "Ջնջել օգտատիրոջը",
      `Դուք պատրաստվում եք ջնջել "${userToDelete.name}" օգտատիրոջը: Այս գործողությունը անդառնալի է: Դուք հաստատո՞ւմ եք այս գործողությունը:`,
      async () => {
        setIsConfirming(true);
        try {
          await deleteUser(userId);
        } finally {
          setIsConfirming(false);
        }
      }
    );
  }, [users, deleteUser, showConfirm]);

  const supervisors = users.filter(user => 
    user.role === 'supervisor' || user.role === 'project_manager'
  );
  
  const students = users.filter(user => user.role === 'student');
  
  return {
    users,
    loading,
    openNewUser,
    openEditUser,
    newUser,
    supervisors,
    students,
    showConfirmDialog,
    confirmTitle,
    confirmDescription,
    confirmAction,
    isConfirming,
    setOpenNewUser,
    setNewUser,
    handleCreateUser,
    handleEditUser,
    handleUpdateUser,
    handleAssignSupervisor,
    handleDeleteUser,
    setShowConfirmDialog
  };
};
