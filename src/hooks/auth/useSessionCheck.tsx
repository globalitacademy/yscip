
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
