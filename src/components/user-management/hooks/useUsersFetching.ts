
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUsersFetching = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*');
        
        if (error) {
          console.error('Error fetching users:', error);
          toast.error('Սխալ է տեղի ունեցել օգտատերերի տվյալները բեռնելիս։');
          
          // Fallback to mock data if Supabase fails
          setUsers(mockUsers);
        } else if (data) {
          // Map Supabase users to our User type
          const mappedUsers: User[] = data.map(dbUser => ({
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            department: dbUser.department || '',
            avatar: dbUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.id}`,
            course: dbUser.course,
            group: dbUser.group_name,
            registrationApproved: dbUser.registration_approved,
            organization: dbUser.organization
          }));
          setUsers(mappedUsers);
        }
      } catch (error) {
        console.error('Error in fetchUsers:', error);
        // Fallback to mock data
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return {
    users,
    setUsers,
    loading
  };
};
