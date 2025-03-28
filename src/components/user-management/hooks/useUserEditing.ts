
import { useState } from 'react';
import { User, UserRole } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUserEditing = (
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  showConfirm: (title: string, description: string, action: () => Promise<void>) => void,
  setIsConfirming: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [openEditUser, setOpenEditUser] = useState<string | null>(null);
  const [editUserData, setEditUserData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'student',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    course: '',
    group: ''
  });

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    setEditUserData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      course: user.course,
      group: user.group
    });
    
    setOpenEditUser(userId);
  };
  
  const handleUpdateUser = async () => {
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
          // Update user in Supabase
          const { data, error } = await supabase
            .from('users')
            .update({
              name: editUserData.name,
              role: editUserData.role,
              department: editUserData.department,
              course: editUserData.role === 'student' ? editUserData.course : null,
              group_name: editUserData.role === 'student' ? editUserData.group : null,
              updated_at: new Date().toISOString()
            })
            .eq('id', openEditUser);

          if (error) {
            console.error('Error updating user in Supabase:', error);
            // Still update local state for better UX
            toast.warning("Տվյալների բազայի սինքրոնիզացումը ձախողվեց, բայց լոկալ փոփոխությունները պահպանվել են։");
          } else {
            toast.success("Օգտատիրոջ տվյալները հաջողությամբ թարմացվել են։");
          }

          // Update local state
          setUsers(prev => prev.map(user => {
            if (user.id === openEditUser) {
              return {
                ...user,
                name: editUserData.name || user.name,
                email: editUserData.email || user.email,
                role: editUserData.role as UserRole || user.role,
                department: editUserData.department || user.department,
                course: editUserData.role === 'student' ? editUserData.course : undefined,
                group: editUserData.role === 'student' ? editUserData.group : undefined
              };
            }
            return user;
          }));
        } catch (error) {
          console.error('Error in handleUpdateUser:', error);
          toast.error("Սխալ է տեղի ունեցել օգտատիրոջ տվյալները թարմացնելիս։");
        } finally {
          setIsConfirming(false);
          setEditUserData({
            name: '',
            email: '',
            role: 'student',
            department: 'Ինֆորմատիկայի ֆակուլտետ',
            course: '',
            group: ''
          });
          setOpenEditUser(null);
        }
      }
    );
  };

  return {
    openEditUser,
    editUserData: editUserData,
    setEditUserData,
    handleEditUser,
    handleUpdateUser
  };
};
