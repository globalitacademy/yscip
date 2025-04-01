
import { useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { PendingUser } from '@/types/auth';
import { toast } from 'sonner';
import { mapDatabaseUserToUserModel } from './utils';

export const useAuthStateChange = (
  isAuthenticated: boolean,
  setUser: (user: User | null) => void,
  setIsAuthenticated: (value: boolean) => void,
  pendingUsers: PendingUser[]
) => {
  useEffect(() => {
    // Set up real-time auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      // Handle direct admin login specially - don't disrupt it
      const storedUserJson = localStorage.getItem('currentUser');
      if (storedUserJson) {
        try {
          const parsedUser = JSON.parse(storedUserJson);
          if (parsedUser.email === 'gitedu@bk.ru' && isAuthenticated) {
            console.log('Admin already logged in, ignoring auth state change');
            return;
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // Continue with auth state change handling
        }
      }
      
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
        // Don't sign out admin user if this is just a Supabase session timeout
        const storedUserJson = localStorage.getItem('currentUser');
        if (storedUserJson) {
          try {
            const parsedUser = JSON.parse(storedUserJson);
            if (parsedUser.email === 'gitedu@bk.ru') {
              console.log('Admin user sign out prevented - keeping admin session active');
              return;
            }
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            // Continue with sign out
          }
        }
        
        console.log('User signed out');
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUser');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, setUser, setIsAuthenticated, pendingUsers]);
};
