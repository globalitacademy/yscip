
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';
import { getUserBySession } from '../utils/sessionHelpers';

export function useSession() {
  const [user, setUser] = useState<DBUser | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('useSession hook initialized');

  const refreshUser = useCallback(async (session: any) => {
    if (!session) {
      console.log('No session to refresh user');
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Refreshing user data for session:', session.user.id);
      setLoading(true);
      const userData = await getUserBySession(session);
      
      if (userData) {
        console.log('User data refreshed successfully:', userData.id);
        setUser(userData);
      } else {
        console.log('Failed to get user data during refresh');
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        setLoading(true);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) setUser(null);
          return;
        }
        
        console.log('Initial session check result:', session ? 'Session found' : 'No session');
        
        if (session) {
          console.log('Initial session found, getting user data');
          const userData = await getUserBySession(session);
          
          if (userData && mounted) {
            console.log('Initial user data fetched successfully:', userData.id);
            setUser(userData);
          } else if (mounted) {
            console.log('No user data found for initial session');
            setUser(null);
          }
        } else if (mounted) {
          console.log('No session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Unexpected error getting initial session:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getInitialSession();
    
    return () => {
      mounted = false;
    };
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    setUser,
    refreshUser
  };
}
