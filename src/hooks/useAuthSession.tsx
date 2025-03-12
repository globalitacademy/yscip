
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
  const [sessionChecked, setSessionChecked] = useState(false);

  // Function to map database user to application user model
  const mapDatabaseUserToUserModel = (userData: any): User => {
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role as UserRole,
      avatar: userData.avatar,
      department: userData.department,
      registrationApproved: userData.registration_approved,
      organization: userData.organization
    };
  };

  useEffect(() => {
    // Initial session check
    const initSession = async () => {
      try {
        console.log('Checking initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Session found, fetching user data');
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching user data:', error);
            setSessionChecked(true);
            return;
          }
          
          if (userData) {
            const loggedInUser = mapDatabaseUserToUserModel(userData);
            
            if (!userData.registration_approved) {
              console.log('User not approved yet:', loggedInUser.email);
              toast.error('Ձեր հաշիվը սպասում է ադմինիստրատորի հաստատման։');
              await supabase.auth.signOut();
              setSessionChecked(true);
              return;
            }
            
            console.log('User authenticated:', loggedInUser.email, loggedInUser.role);
            setUser(loggedInUser);
            setIsAuthenticated(true);
            localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
          }
        } else {
          // Check localStorage as fallback
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            console.log('Found stored user, verifying with Supabase');
            const parsedUser = JSON.parse(storedUser);
            
            // Verify stored user with Supabase
            try {
              const { data: { session: verifySession } } = await supabase.auth.getSession();
              if (verifySession?.user) {
                console.log('Stored user verified with active session');
                setUser(parsedUser);
                setIsAuthenticated(true);
              } else {
                // Clear invalid stored session
                console.log('Stored user has no active session, clearing');
                localStorage.removeItem('currentUser');
                setUser(null);
                setIsAuthenticated(false);
              }
            } catch (error) {
              console.error('Error verifying stored user:', error);
              localStorage.removeItem('currentUser');
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        }
        setSessionChecked(true);
      } catch (error) {
        console.error('Error in initSession:', error);
        setSessionChecked(true);
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
            const loggedInUser = mapDatabaseUserToUserModel(userData);
            
            if (!userData.registration_approved) {
              console.log('User not approved yet:', loggedInUser.email);
              toast.error('Ձեր հաշիվը սպասում է ադմինիստրատորի հաստատման։');
              await supabase.auth.signOut();
              return;
            }
            
            console.log('User signed in:', loggedInUser.email, loggedInUser.role);
            setUser(loggedInUser);
            setIsAuthenticated(true);
            localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
            
            // Force a refresh of admin status for main admin
            if (userData.email === 'gitedu@bk.ru') {
              console.log('Ensuring admin activation for main admin');
              try {
                await supabase.functions.invoke('ensure-admin-activation');
              } catch (error) {
                console.error('Error ensuring admin activation:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          toast.error('Սխալ է տեղի ունեցել օգտատիրոջ տվյալները բեռնելիս');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUser');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed, updating session');
        // Check if we have a user and refresh their data
        if (session?.user) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (!error && userData) {
            const loggedInUser = mapDatabaseUserToUserModel(userData);
            setUser(loggedInUser);
            setIsAuthenticated(true);
            localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
          }
        }
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
