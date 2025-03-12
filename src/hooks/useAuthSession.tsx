
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
        
        // First, check localStorage for a stored user (for compatibility with previous approach)
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          console.log('Found stored user');
          const parsedUser = JSON.parse(storedUser);
          
          // Check if this is the admin user first
          if (parsedUser.email === 'gitedu@bk.ru') {
            console.log('Admin user found in localStorage');
            setUser(parsedUser);
            setIsAuthenticated(true);
            setSessionChecked(true);
            return;
          }
          
          // For non-admin users, verify with Supabase if possible
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              console.log('Supabase session exists, using that instead');
              // Continue with Supabase session below
            } else {
              // Just use the stored user if no Supabase session exists
              console.log('No Supabase session, using stored user');
              setUser(parsedUser);
              setIsAuthenticated(true);
              setSessionChecked(true);
              return;
            }
          } catch (error) {
            console.log('Error checking Supabase session, falling back to stored user');
            setUser(parsedUser);
            setIsAuthenticated(true);
            setSessionChecked(true);
            return;
          }
        }
        
        // Check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('Session found, fetching user data');
          
          try {
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
          } catch (error) {
            console.error('Error fetching user data from Supabase:', error);
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
