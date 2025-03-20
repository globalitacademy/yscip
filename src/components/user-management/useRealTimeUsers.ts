
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import { toast } from 'sonner';

export const useRealTimeUsers = (
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  useEffect(() => {
    // Subscribe to users table changes
    const usersSubscription = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          console.log('User real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newUser = payload.new as any;
            setUsers(prevUsers => {
              if (!prevUsers.some(u => u.id === newUser.id)) {
                const mappedUser: User = {
                  id: newUser.id,
                  name: newUser.name,
                  email: newUser.email,
                  role: newUser.role as any,
                  department: newUser.department || '',
                  avatar: newUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.id}`,
                  course: newUser.course,
                  group: newUser.group_name,
                  registrationApproved: newUser.registration_approved,
                  organization: newUser.organization
                };
                
                toast.success(`Նոր օգտատեր գրանցվեց: ${mappedUser.name}`);
                return [mappedUser, ...prevUsers];
              }
              return prevUsers;
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedUser = payload.new as any;
            setUsers(prevUsers => 
              prevUsers.map(user => {
                if (user.id === updatedUser.id) {
                  const mappedUser: User = {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role as any,
                    department: updatedUser.department || '',
                    avatar: updatedUser.avatar || user.avatar,
                    course: updatedUser.course,
                    group: updatedUser.group_name,
                    registrationApproved: updatedUser.registration_approved,
                    organization: updatedUser.organization
                  };
                  return mappedUser;
                }
                return user;
              })
            );
            toast.success(`Օգտատիրոջ տվյալները թարմացվեցին: ${updatedUser.name}`);
          } else if (payload.eventType === 'DELETE') {
            const deletedUser = payload.old as any;
            setUsers(prevUsers => 
              prevUsers.filter(user => user.id !== deletedUser.id)
            );
            toast.success(`Օգտատերը ջնջվեց: ${deletedUser.name}`);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(usersSubscription);
    };
  }, [setUsers]);
};
