
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';

interface AuthStateProviderProps {
  children: React.ReactNode;
  refreshUser: (session: any) => Promise<void>;
  setUser: (user: DBUser | null) => void;
}

export const AuthStateProvider: React.FC<AuthStateProviderProps> = ({ 
  children, 
  refreshUser, 
  setUser 
}) => {
  useEffect(() => {
    console.log('Setting up auth state change listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('User signed in or token refreshed, refreshing user data');
          if (session) {
            await refreshUser(session);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing user data');
          setUser(null);
        } else if (event === 'USER_UPDATED') {
          console.log('User data updated, refreshing user data');
          if (session) {
            await refreshUser(session);
          }
        }
      }
    );

    // Check for existing session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('Found existing session, refreshing user data');
        await refreshUser(session);
      }
    };
    
    checkSession();

    return () => {
      console.log('Cleaning up auth state change listener');
      subscription?.unsubscribe();
    };
  }, [setUser, refreshUser]);

  return <>{children}</>;
};
