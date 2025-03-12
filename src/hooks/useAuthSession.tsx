
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/data/userRoles';
import { supabase } from '@/integrations/supabase/client';
import { PendingUser } from '@/types/auth';
import { toast } from 'sonner';

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

  useEffect(() => {
    // Initial session check
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }
        
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
      } else {
        // Check localStorage as fallback
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Verify stored user with Supabase
          const { data: { session: verifySession } } = await supabase.auth.getSession();
          if (verifySession?.user) {
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // Clear invalid stored session
            localStorage.removeItem('currentUser');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }
    };

    initSession();
    
    // Set up real-time auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
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
          toast.error('Սխալ է տեղի ունեցել օգտատիրոջ տվյալները բեռնելիս');
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUser');
      }
    });

    // Load pending users from localStorage
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
