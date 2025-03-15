
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { PendingUser, DemoAccount } from '@/types/auth';
import { mockUsers } from '@/data/mockUsers';
import { supabase } from '@/integrations/supabase/client';

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);

  useEffect(() => {
    // Check if there's a persisted session
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Try to get session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session) {
          // Found a Supabase session
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userData && !userError) {
            // Map to our User type
            const authUser: User = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              department: userData.department || '',
              avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.id}`,
              course: userData.course,
              group: userData.group_name,
              organization: userData.organization,
              registrationApproved: userData.registration_approved
            };
            
            setUser(authUser);
            setIsAuthenticated(true);
          } else if (error) {
            console.error('Error fetching user data:', userError);
          }
        } else {
          // Check local storage
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        }

        // Load demo accounts from localStorage
        const storedDemoAccounts = localStorage.getItem('demoAccounts');
        if (storedDemoAccounts) {
          setDemoAccounts(JSON.parse(storedDemoAccounts));
        } else {
          // Initialize with default demo accounts
          const defaultDemoAccounts: DemoAccount[] = mockUsers.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            password: 'password123'
          }));
          
          setDemoAccounts(defaultDemoAccounts);
          localStorage.setItem('demoAccounts', JSON.stringify(defaultDemoAccounts));
        }

      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    user,
    isAuthenticated,
    pendingUsers,
    isLoading,
    demoAccounts,
    setUser,
    setIsAuthenticated,
    setPendingUsers,
    setDemoAccounts
  };
};
