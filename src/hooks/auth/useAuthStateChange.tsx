
import { useEffect } from 'react';
import { User, UserRole } from '@/types/user';
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
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email === 'gitedu@bk.ru' && isAuthenticated) {
          console.log('Admin already logged in, ignoring auth state change');
          return;
        }
      }
      
      // For SIGNED_OUT events, only process them if they were triggered by the user explicitly
      // clicking the logout button, which is tracked by a flag in localStorage
      if (event === 'SIGNED_OUT') {
        const userInitiatedLogout = localStorage.getItem('user_initiated_logout') === 'true';
        
        // Don't sign out admin user if this is just a Supabase session timeout
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.email === 'gitedu@bk.ru') {
            console.log('Admin user sign out prevented - keeping admin session active');
            return;
          }
        }
        
        if (!userInitiatedLogout) {
          console.log('Ignoring automatic sign out event - user did not initiate logout');
          // Try to refresh the token instead
          try {
            const storedSession = localStorage.getItem('supabase.auth.token');
            if (storedSession) {
              const session = JSON.parse(storedSession);
              if (session.refresh_token) {
                console.log('Attempting to refresh token...');
                await supabase.auth.refreshSession({
                  refresh_token: session.refresh_token,
                });
                console.log('Token refreshed');
              }
            }
          } catch (error) {
            console.error('Error refreshing token:', error);
          }
          return;
        }
        
        // Reset the flag after processing
        localStorage.removeItem('user_initiated_logout');
        
        console.log('User signed out');
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('supabase.auth.token');
      } else if (event === 'SIGNED_IN' && session) {
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
            
            // Store complete session for better persistence
            localStorage.setItem('supabase.auth.token', JSON.stringify({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
              expires_at: session.expires_at,
              user: session.user
            }));
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          toast.error('Սխալ է տեղի ունեցել օգտատիրոջ տվյալները բեռնելիս');
        }
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // When token is refreshed, update the stored token
        console.log('Token refreshed, updating stored session');
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
          user: session.user
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, setUser, setIsAuthenticated, pendingUsers]);
};
