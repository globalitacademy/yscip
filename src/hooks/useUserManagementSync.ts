
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types/user';
import { toast } from 'sonner';

export const useUserManagementSync = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const mappedUsers: User[] = data.map(dbUser => ({
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role as UserRole,
          department: dbUser.department || '',
          avatar: dbUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.id}`,
          course: dbUser.course,
          group: dbUser.group_name,
          registrationApproved: dbUser.registration_approved,
          organization: dbUser.organization,
          specialization: dbUser.specialization
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Սխալ է տեղի ունեցել օգտատերերի տվյալները բեռնելիս։');
    } finally {
      setLoading(false);
    }
  };
  
  const createUser = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      // Create user in Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email!,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          role: userData.role
        }
      });
      
      if (authError) {
        throw authError;
      }
      
      if (authData.user) {
        // User data is inserted automatically via trigger
        toast.success(`${userData.name} օգտատերը հաջողությամբ ստեղծվել է։`);
        await fetchUsers(); // Refresh users list
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Սխալ է տեղի ունեցել օգտատիրոջը ստեղծելիս։');
      return false;
    }
  };
  
  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          role: userData.role,
          department: userData.department,
          course: userData.course,
          group_name: userData.group,
          specialization: userData.specialization,
          organization: userData.organization,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      toast.success("Օգտատիրոջ տվյալները հաջողությամբ թարմացվել են։");
      await fetchUsers(); // Refresh users list
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Սխալ է տեղի ունեցել օգտատիրոջ տվյալները թարմացնելիս։');
      return false;
    }
  };
  
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      // Delete user from Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        throw authError;
      }
      
      // User in 'users' table will be deleted via cascade delete
      toast.success("Օգտատերը հաջողությամբ ջնջվել է համակարգից։");
      await fetchUsers(); // Refresh users list
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Սխալ է տեղի ունեցել օգտատիրոջը ջնջելիս։');
      return false;
    }
  };
  
  useEffect(() => {
    fetchUsers();
    
    // Set up real-time subscription to user changes
    const channel = supabase
      .channel('users-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users'
      }, () => {
        fetchUsers();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return {
    users,
    loading,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers: fetchUsers
  };
};
