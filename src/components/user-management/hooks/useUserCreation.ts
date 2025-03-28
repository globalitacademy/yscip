
import { useState } from 'react';
import { User, UserRole } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserCreationDialogState } from '../types/dialogStates';

export const useUserCreation = (
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  showConfirm: (title: string, description: string, action: () => Promise<void>) => void,
  setIsConfirming: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [dialogState, setDialogState] = useState<UserCreationDialogState>({
    openNewUser: false,
    newUser: {
      name: '',
      email: '',
      role: 'student',
      department: 'Ինֆորմատիկայի ֆակուլտետ',
      course: '',
      group: ''
    }
  });

  const setOpenNewUser = (open: boolean) => {
    setDialogState({
      ...dialogState,
      openNewUser: open
    });
  };

  const setNewUser = (user: Partial<User>) => {
    setDialogState({
      ...dialogState,
      newUser: user
    });
  };

  const handleCreateUser = async () => {
    const { newUser } = dialogState;
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error("Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը");
      return;
    }

    // Show confirmation dialog
    showConfirm(
      "Ստեղծել նոր օգտատեր",
      `Դուք պատրաստվում եք ստեղծել նոր օգտատեր անունով "${newUser.name}": Դուք հաստատո՞ւմ եք այս գործողությունը:`,
      async () => {
        setIsConfirming(true);
        try {
          // First try to create user in Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: newUser.email!,
            email_confirm: true,
            user_metadata: {
              name: newUser.name,
              role: newUser.role
            },
            password: 'Password123!' // Temporary password
          });

          if (authError) {
            console.error('Error creating user in auth:', authError);
            // Fallback to local creation
            const id = `user-${Date.now()}`;
            const createdUser: User = {
              id,
              name: newUser.name!,
              email: newUser.email!,
              role: newUser.role as UserRole,
              department: newUser.department,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
              course: newUser.role === 'student' ? newUser.course : undefined,
              group: newUser.role === 'student' ? newUser.group : undefined
            };

            setUsers(prev => [...prev, createdUser]);
            toast.success(`${createdUser.name} օգտատերը հաջողությամբ ստեղծվել է (Լոկալ)։`);
          } else if (authData.user) {
            // If successful, create user profile in users table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .upsert({
                id: authData.user.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role as UserRole,
                department: newUser.department,
                course: newUser.role === 'student' ? newUser.course : undefined,
                group_name: newUser.role === 'student' ? newUser.group : undefined,
                registration_approved: true,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.id}`
              });

            if (userError) {
              console.error('Error creating user in users table:', userError);
              toast.error("Սխալ է տեղի ունեցել օգտատիրոջը ստեղծելիս։");
            } else {
              // Add the new user to the local state
              const createdUser: User = {
                id: authData.user.id,
                name: newUser.name!,
                email: newUser.email!,
                role: newUser.role as UserRole,
                department: newUser.department,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.id}`,
                course: newUser.role === 'student' ? newUser.course : undefined,
                group: newUser.role === 'student' ? newUser.group : undefined,
                registrationApproved: true
              };

              setUsers(prev => [...prev, createdUser]);
              toast.success(`${createdUser.name} օգտատերը հաջողությամբ ստեղծվել է։`);
            }
          }
        } catch (error) {
          console.error('Error creating user:', error);
          toast.error("Սխալ է տեղի ունեցել օգտատիրոջը ստեղծելիս։");
        } finally {
          setIsConfirming(false);
          setDialogState({
            openNewUser: false,
            newUser: {
              name: '',
              email: '',
              role: 'student',
              department: 'Ինֆորմատիկայի ֆակուլտետ',
              course: '',
              group: ''
            }
          });
        }
      }
    );
  };

  return {
    ...dialogState,
    setOpenNewUser,
    setNewUser,
    handleCreateUser
  };
};
