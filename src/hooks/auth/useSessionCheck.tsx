
import { useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { PendingUser } from '@/types/auth';
import { toast } from 'sonner';
import { mapDatabaseUserToUserModel } from './utils';

export const useSessionCheck = (
  setUser: (user: User | null) => void,
  setIsAuthenticated: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  pendingUsers: PendingUser[]
) => {
  useEffect(() => {
    // Initial session check
    const initSession = async () => {
      try {
        console.log('Checking initial session...');
        setIsLoading(true);
        
        // First, check localStorage for a stored user (for compatibility with previous approach)
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          console.log('Found stored user');
          const parsedUser = JSON.parse(storedUser);
          
          // Check if this is the admin user first - handle admin separately
          if (parsedUser.email === 'gitedu@bk.ru') {
            console.log('Admin user found in localStorage');
            setUser(parsedUser);
            setIsAuthenticated(true);
            setIsLoading(false);
            
            // Try to silently refresh admin session in background
            try {
              await supabase.functions.invoke('ensure-admin-activation');
              console.log('Background admin activation called during session check');
            } catch (err) {
              console.error('Background admin activation error:', err);
            }
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
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.log('Error checking Supabase session, falling back to stored user');
            setUser(parsedUser);
            setIsAuthenticated(true);
            setIsLoading(false);
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
              setIsLoading(false);
              return;
            }
            
            if (userData) {
              const loggedInUser = mapDatabaseUserToUserModel(userData);
              
              if (!userData.registration_approved) {
                console.log('User not approved yet:', loggedInUser.email);
                toast.error('Ձեր հաշիվը սպասում է ադմինիստրատորի հաստատման։');
                await supabase.auth.signOut();
                setIsLoading(false);
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
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error in initSession:', error);
        setIsLoading(false);
      }
    };

    initSession();
  }, [setUser, setIsAuthenticated, setIsLoading, pendingUsers]);
};
