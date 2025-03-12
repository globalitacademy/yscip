
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/data/userRoles';
import { supabase } from '@/integrations/supabase/client';
import { PendingUser } from '@/types/auth';

interface UseAuthSessionResult {
  user: User | null;
  isAuthenticated: boolean;
  pendingUsers: PendingUser[];
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>;
}

export const useAuthSession = (): UseAuthSessionResult => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);

  // Load initial session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) throw error;
          
          if (userData) {
            const loggedInUser: User = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role as UserRole,
              avatar: userData.avatar,
              department: userData.department,
              registrationApproved: userData.registration_approved,
            };
            
            setUser(loggedInUser);
            setIsAuthenticated(true);
            localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            const { data: userData, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) throw error;
            
            if (userData) {
              const loggedInUser: User = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role as UserRole,
                avatar: userData.avatar,
                department: userData.department,
                registrationApproved: userData.registration_approved,
              };
              
              setUser(loggedInUser);
              setIsAuthenticated(true);
              localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('currentUser');
        }
      }
    );
    
    const storedPendingUsers = localStorage.getItem('pendingUsers');
    if (storedPendingUsers) {
      setPendingUsers(JSON.parse(storedPendingUsers));
    }
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Save pendingUsers to localStorage when it changes
  useEffect(() => {
    if (pendingUsers.length > 0) {
      localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
    }
  }, [pendingUsers]);

  return {
    user,
    isAuthenticated,
    pendingUsers,
    setUser,
    setIsAuthenticated,
    setPendingUsers
  };
};
