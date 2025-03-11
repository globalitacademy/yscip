
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';
import { getUserBySession } from '../utils/sessionHelpers';

export function useSession() {
  const [user, setUser] = useState<DBUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useSession hook initialized');
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Session found, fetching user data...');
          const userData = await getUserBySession(session);
          
          if (userData) {
            console.log('User data fetched successfully:', userData);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            console.error('User data could not be fetched from the database');
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log('No session found');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in, fetching user data...');
        const userData = await getUserBySession(session);
        
        if (userData) {
          console.log('User data fetched after sign in:', userData);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          console.error('User data could not be fetched after sign in');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setIsAuthenticated(false);
      } else if (event === 'USER_UPDATED' && session) {
        console.log('User updated, fetching fresh user data...');
        const userData = await getUserBySession(session);
        
        if (userData) {
          console.log('User data updated:', userData);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          console.error('User data could not be fetched after update');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    setUser
  };
}
