
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
            return;
          }
        }
        
        // Try to restore stored session
        const storedSession = localStorage.getItem('supabase.auth.token');
        if (storedSession) {
          try {
            const session = JSON.parse(storedSession);
            
            // Check if session has expired
            const isExpired = session.expires_at && new Date(session.expires_at * 1000) < new Date();
            
            if (isExpired) {
              console.log('Session has expired, attempting to refresh token');
              // Try to refresh the token
              const { data, error } = await supabase.auth.refreshSession({
                refresh_token: session.refresh_token,
              });
              
              if (error) {
                console.error('Error refreshing token:', error);
                // Continue with regular session check
              } else if (data.session) {
                // Update stored token with refreshed session
                localStorage.setItem('supabase.auth.token', JSON.stringify({
                  access_token: data.session.access_token,
                  refresh_token: data.session.refresh_token,
                  expires_at: data.session.expires_at,
                  user: data.session.user
                }));
                
                console.log('Token refreshed successfully');
              }
            } else {
              // Set the session in Supabase
              await supabase.auth.setSession({
                access_token: session.access_token,
                refresh_token: session.refresh_token
              });
              
              console.log('Restored session from localStorage');
            }
          } catch (error) {
            console.error('Error restoring session from localStorage:', error);
            // Continue with regular session check
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
              
              // Store complete session for better persistence
              localStorage.setItem('supabase.auth.token', JSON.stringify({
                access_token: session.access_token,
                refresh_token: session.refresh_token,
                expires_at: session.expires_at,
                user: session.user
              }));
            }
          } catch (error) {
            console.error('Error fetching user data from Supabase:', error);
          }
        } else {
          // Try fallback to stored user if no active session
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            console.log('No active session, using stored user as fallback');
            setUser(parsedUser);
            setIsAuthenticated(true);
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
